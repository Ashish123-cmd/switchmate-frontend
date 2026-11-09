import { useEffect, useState } from 'react';
import { useServices } from '@/app/ServicesProvider';
import { useToast } from '@/app/ToastProvider';
import type { WizardData } from '@/features/onboarding/types';
import { profileStepSchema } from '@/features/onboarding/schemas/profileSchema';
import { preferencesSchema } from '@/features/onboarding/schemas/preferencesSchema';
import { standardAnswersSchema } from '@/features/onboarding/schemas/standardAnswersSchema';

export type EditableSettingsTab = 'profile' | 'preferences' | 'standard-answers';

export function useSettingsFormData() {
  const { profile: profileService } = useServices();
  const { showToast } = useToast();
  const [data, setData] = useState<WizardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadVersion, setLoadVersion] = useState(0);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setLoadError(null);

    async function loadSettingsForms() {
      try {
        const [profile, preferences, standardAnswers] = await Promise.all([
          profileService.getProfile(),
          profileService.getPreferences(),
          profileService.getStandardAnswers(),
        ]);
        if (active) {
          setData({
            profile,
            preferences,
            standardAnswers,
            resumeUpload: { file: null, status: 'idle', error: null },
          });
        }
      } catch (error) {
        if (active) {
          setLoadError(error instanceof Error ? error.message : 'Unable to load settings.');
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void loadSettingsForms();
    return () => {
      active = false;
    };
  }, [profileService, loadVersion]);

  function updateData(updates: Partial<WizardData>) {
    setData((current) => (current ? { ...current, ...updates } : current));
  }

  function canSave(tab: EditableSettingsTab): boolean {
    if (!data) return false;
    if (tab === 'profile') return profileStepSchema.safeParse(data.profile).success;
    if (tab === 'preferences') return preferencesSchema.safeParse(data.preferences).success;
    return standardAnswersSchema.safeParse(data.standardAnswers).success;
  }

  async function save(tab: EditableSettingsTab): Promise<boolean> {
    if (!data || !canSave(tab)) {
      showToast('Review the highlighted fields before saving.', 'error');
      return false;
    }
    setIsSaving(true);
    try {
      if (tab === 'profile') await profileService.saveProfile(data.profile);
      else if (tab === 'preferences') await profileService.savePreferences(data.preferences);
      else await profileService.saveStandardAnswers(data.standardAnswers);
      showToast('Settings saved.');
      return true;
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to save settings.', 'error');
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  function refetch() {
    setLoadVersion((version) => version + 1);
  }

  return { data, isLoading, isSaving, loadError, updateData, canSave, save, refetch };
}
