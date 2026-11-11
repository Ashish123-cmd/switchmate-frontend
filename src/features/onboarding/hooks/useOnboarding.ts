import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/AuthContext';
import { useServices } from '@/app/ServicesProvider';
import { useWizard } from '@/features/onboarding/hooks/useWizard';
import type { WizardData } from '@/features/onboarding/types';
import { wizardSteps } from '@/features/onboarding/wizardSteps';

export function useOnboarding() {
  const services = useServices();
  const { currentUser, refreshProfileStatus } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<WizardData | null>(null);
  const wizard = useWizard(wizardSteps, data?.profile ?? null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadVersion, setLoadVersion] = useState(0);
  const [finishError, setFinishError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    setLoadError(null);

    async function loadProfile() {
      try {
        const [profile, preferences, standardAnswers] = await Promise.all([
          services.profile.getProfile(),
          services.profile.getPreferences(),
          services.profile.getStandardAnswers(),
        ]);
        if (!active) return;
        setData({
          profile: { ...profile, email: currentUser ?? profile.email },
          preferences,
          standardAnswers,
          resumeUpload: { file: null, status: 'idle', error: null },
        });
      } catch (error) {
        if (active) {
          setLoadError(
            error instanceof Error
              ? error.message
              : 'Unable to load your profile. Please try again.',
          );
        }
      }
    }

    void loadProfile();
    return () => {
      active = false;
    };
  }, [currentUser, services.profile, loadVersion]);

  function refetch() {
    setData(null);
    setLoadVersion((version) => version + 1);
  }

  function updateData(updates: Partial<WizardData>) {
    setData((current) => (current ? { ...current, ...updates } : current));
  }

  async function finish(dataToSave: WizardData) {
    setFinishError(null);
    setIsSubmitting(true);
    try {
      await services.profile.saveProfile(dataToSave.profile);
      await services.profile.completeProfile();
      const completed = await refreshProfileStatus();
      if (!completed) throw new Error('Complete your profile before continuing.');
      navigate('/jobs', { replace: true });
    } catch (error) {
      setFinishError(error instanceof Error ? error.message : 'Unable to save your profile.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function next(dataToFinish: WizardData) {
    if (wizard.isLast) {
      void finish(dataToFinish);
    } else {
      wizard.next();
    }
  }

  return {
    wizard,
    data,
    loadError,
    refetch,
    finishError,
    isSubmitting,
    updateData,
    next,
  };
}
