import { useEffect, useState } from 'react';
import { useServices } from '@/app/ServicesProvider';
import type { MatchedJob } from '@/domain/types';

export function useMatchedJobs() {
  const { jobs: jobService, profile: profileService } = useServices();
  const [jobs, setJobs] = useState<MatchedJob[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(() => new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [refreshVersion, setRefreshVersion] = useState(0);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);

    async function loadJobs() {
      try {
        const [profile, savedIds] = await Promise.all([
          profileService.getProfile(),
          jobService.getSavedJobIds(),
        ]);
        const matchedJobs = await jobService.listMatchedJobs(profile);
        if (!active) return;
        setSavedJobIds(new Set(savedIds));
        setJobs([...matchedJobs].sort((first, second) => second.score - first.score));
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Unable to load jobs. Please try again.',
          );
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void loadJobs();
    return () => {
      active = false;
    };
  }, [jobService, profileService, refreshVersion]);

  function refetch() {
    setRefreshVersion((version) => version + 1);
  }

  async function saveJob(jobId: string) {
    if (savedJobIds.has(jobId)) return;
    setActionError(null);
    setSavedJobIds((current) => new Set(current).add(jobId));
    try {
      await jobService.saveJob(jobId);
    } catch (saveError) {
      setSavedJobIds((current) => {
        const next = new Set(current);
        next.delete(jobId);
        return next;
      });
      setActionError(saveError instanceof Error ? saveError.message : 'Unable to save this job.');
    }
  }

  async function hideJob(jobId: string) {
    const hiddenJob = jobs.find((matchedJob) => matchedJob.job.id === jobId);
    if (!hiddenJob) return;
    setActionError(null);
    setJobs((current) => current.filter((matchedJob) => matchedJob.job.id !== jobId));
    setSavedJobIds((current) => {
      const next = new Set(current);
      next.delete(jobId);
      return next;
    });
    try {
      await jobService.hideJob(jobId);
    } catch (hideError) {
      setJobs((current) =>
        [...current, hiddenJob].sort((first, second) => second.score - first.score),
      );
      setActionError(hideError instanceof Error ? hideError.message : 'Unable to hide this job.');
    }
  }

  return { jobs, savedJobIds, isLoading, error, actionError, refetch, saveJob, hideJob };
}
