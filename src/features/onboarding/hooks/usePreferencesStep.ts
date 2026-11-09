import { useState } from 'react';
import { useServices } from '@/app/ServicesProvider';
import type { JobPreferences } from '@/domain/types';
import type { WizardStepProps } from '@/features/onboarding/types';
import { preferencesSchema } from '@/features/onboarding/schemas/preferencesSchema';

export function usePreferencesStep({
  data,
  onChange,
  onNext,
}: Pick<WizardStepProps, 'data' | 'onChange' | 'onNext'>) {
  const { profile } = useServices();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const preferences = data.preferences;
  const validation = preferencesSchema.safeParse(preferences);
  const issues = validation.success ? [] : validation.error.issues;

  function errorFor(field: keyof JobPreferences): string | undefined {
    return issues.find((issue) => issue.path[0] === field)?.message;
  }

  function update<K extends keyof JobPreferences>(field: K, value: JobPreferences[K]) {
    onChange({ preferences: { ...preferences, [field]: value } });
  }

  async function saveAndContinue() {
    const result = preferencesSchema.safeParse(preferences);
    if (!result.success) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      await profile.savePreferences(result.data);
      onNext?.();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Unable to save your preferences.');
    } finally {
      setIsSaving(false);
    }
  }

  return {
    preferences,
    isValid: validation.success,
    isSaving,
    saveError,
    errorFor,
    update,
    saveAndContinue,
  };
}
