import { useEffect, useState } from 'react';
import { useServices } from '@/app/ServicesProvider';
import { useToast } from '@/app/ToastProvider';
import type { Application, Job } from '@/domain/types';
import { notifyAutoApplyQueueUpdated } from '@/features/autoApply/queueEvents';

export interface QueuedAutoApplication {
  application: Application;
  job: Job | null;
}

export function useAutoApplyQueue() {
  const { applications: applicationService, jobs: jobService } = useServices();
  const { showToast } = useToast();
  const [items, setItems] = useState<QueuedAutoApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingIds, setPendingIds] = useState<Set<string>>(() => new Set());
  const [refreshVersion, setRefreshVersion] = useState(0);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);

    async function loadQueue() {
      try {
        const applications = await applicationService.listApplications();
        const queued = applications.filter(
          (application) => application.mode === 'auto' && application.status === 'queued',
        );
        const queueItems = await Promise.all(
          queued.map(async (application) => ({
            application,
            job: await jobService.getJobById(application.jobId),
          })),
        );
        if (active) {
          setItems(
            queueItems.sort((first, second) =>
              first.application.updatedAt.localeCompare(second.application.updatedAt),
            ),
          );
        }
      } catch (loadError) {
        if (active)
          setError(loadError instanceof Error ? loadError.message : 'Unable to load queue.');
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void loadQueue();
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

  async function approve(applicationId: string) {
    const item = items.find(({ application }) => application.id === applicationId);
    if (!item) return;
    setPending(applicationId, true);
    setItems((current) => current.filter(({ application }) => application.id !== applicationId));
    try {
      const updated = await applicationService.updateStatus(applicationId, 'applied');
      if (!updated) throw new Error('Application record could not be found.');
      notifyAutoApplyQueueUpdated();
      showToast('Application approved and marked applied.');
    } catch (actionError) {
      setItems((current) => [...current, item]);
      showToast(
        actionError instanceof Error ? actionError.message : 'Unable to approve application.',
        'error',
      );
    } finally {
      setPending(applicationId, false);
    }
  }

  async function reject(applicationId: string) {
    const item = items.find(({ application }) => application.id === applicationId);
    if (!item) return;
    setPending(applicationId, true);
    setItems((current) => current.filter(({ application }) => application.id !== applicationId));
    try {
      await applicationService.removeApplication(applicationId);
      notifyAutoApplyQueueUpdated();
      showToast('Application removed from the queue.');
    } catch (actionError) {
      setItems((current) => [...current, item]);
      showToast(
        actionError instanceof Error ? actionError.message : 'Unable to reject application.',
        'error',
      );
    } finally {
      setPending(applicationId, false);
    }
  }

  return { items, isLoading, error, pendingIds, refetch, approve, reject };
}
