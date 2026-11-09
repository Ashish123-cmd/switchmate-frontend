import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useServices } from '@/app/ServicesProvider';
import type { MatchedJob } from '@/domain/types';

export function useJobDetail(jobId: string | undefined) {
  const { jobs: jobService, profile: profileService } = useServices();
  const navigate = useNavigate();
  const [matchedJob, setMatchedJob] = useState<MatchedJob | null>(null);
  const [profileSkills, setProfileSkills] = useState<string[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isHiding, setIsHiding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [refreshVersion, setRefreshVersion] = useState(0);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);

    async function loadJob() {
      try {
        if (!jobId) {
          setMatchedJob(null);
          return;
        }
        const [profile, savedIds] = await Promise.all([
          profileService.getProfile(),
          jobService.getSavedJobIds(),
        ]);
        const result = await jobService.getMatchedJobById(jobId, profile);
        if (!active) return;
        setMatchedJob(result);
        setProfileSkills(profile.skills);
        setIsSaved(savedIds.includes(jobId));
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load this job.');
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void loadJob();
    return () => {
      active = false;
    };
  }, [jobId, jobService, profileService, refreshVersion]);

  function refetch() {
    setRefreshVersion((version) => version + 1);
  }

  async function saveJob() {
    if (!jobId || isSaved) return;
    setActionError(null);
    setIsSaved(true);
    try {
      await jobService.saveJob(jobId);
    } catch (saveError) {
      setIsSaved(false);
      setActionError(saveError instanceof Error ? saveError.message : 'Unable to save this job.');
    }
  }

  async function hideJob() {
    if (!jobId) return;
    setIsHiding(true);
    setActionError(null);
    try {
      await jobService.hideJob(jobId);
      navigate('/jobs', { replace: true });
    } catch (hideError) {
      setActionError(hideError instanceof Error ? hideError.message : 'Unable to hide this job.');
    } finally {
      setIsHiding(false);
    }
  }

  return {
    matchedJob,
    profileSkills,
    isSaved,
    isLoading,
    isHiding,
    error,
    actionError,
    refetch,
    saveJob,
    hideJob,
  };
}
