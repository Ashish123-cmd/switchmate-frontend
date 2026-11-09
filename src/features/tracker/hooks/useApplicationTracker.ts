import { useEffect, useState } from 'react';
import { useServices } from '@/app/ServicesProvider';
import { useToast } from '@/app/ToastProvider';
import type { Application, ApplicationStatus, Job } from '@/domain/types';

export interface TrackedApplication {
  application: Application;
  job: Job | null;
}

export function useApplicationTracker() {
  const { applications: applicationService, jobs: jobService } = useServices();
  const { showToast } = useToast();
  const [items, setItems] = useState<TrackedApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingIds, setPendingIds] = useState<Set<string>>(() => new Set());
  const [refreshVersion, setRefreshVersion] = useState(0);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);

    async function loadApplications() {
      try {
        const applications = await applicationService.listApplications();
        const trackedApplications = await Promise.all(
          applications.map(async (application) => ({
            application,
            job: await jobService.getJobById(application.jobId),
          })),
        );
        if (active) {
          setItems(
            trackedApplications.sort((first, second) =>
              second.application.updatedAt.localeCompare(first.application.updatedAt),
            ),
          );
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load applications.');
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void loadApplications();
    return () => {
      active = false;
    };
  }, [applicationService, jobService, refreshVersion]);

  function refetch() {
    setRefreshVersion((version) => version + 1);
  }

  function setPending(id: string, pending: boolean) {
    setPendingIds((current) => {
      const next = new Set(current);
      if (pending) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  async function changeStatus(applicationId: string, status: ApplicationStatus) {
    const originalItem = items.find(({ application }) => application.id === applicationId);
    if (!originalItem || originalItem.application.status === status) return;
    setPending(applicationId, true);
    setItems((current) =>
      current
        .map((item) =>
          item.application.id === applicationId
            ? {
                ...item,
                application: { ...item.application, status, updatedAt: new Date().toISOString() },
              }
            : item,
        )
        .sort((first, second) =>
          second.application.updatedAt.localeCompare(first.application.updatedAt),
        ),
    );

    try {
      const updated = await applicationService.updateStatus(applicationId, status);
      if (!updated) throw new Error('Application record could not be found.');
      setItems((current) =>
        current.map((item) =>
          item.application.id === applicationId ? { ...item, application: updated } : item,
        ),
      );
      showToast('Application status updated.');
    } catch (updateError) {
      setItems((current) =>
        current.map((item) => (item.application.id === applicationId ? originalItem : item)),
      );
      showToast(
        updateError instanceof Error ? updateError.message : 'Unable to update application status.',
        'error',
      );
    } finally {
      setPending(applicationId, false);
    }
  }

  return { items, isLoading, error, pendingIds, refetch, changeStatus };
}
