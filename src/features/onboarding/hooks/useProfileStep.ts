import type { Education, Experience, UserProfile } from '@/domain/types';
import type { WizardStepProps } from '@/features/onboarding/types';
import { profileStepSchema } from '@/features/onboarding/schemas/profileSchema';

export function useProfileStep({ data, onChange }: Pick<WizardStepProps, 'data' | 'onChange'>) {
  const profile = data.profile;
  const validation = profileStepSchema.safeParse(profile);
  const issues = validation.success ? [] : validation.error.issues;

  function errorFor(field: keyof UserProfile): string | undefined {
    return issues.find((issue) => issue.path[0] === field)?.message;
  }

  function updateProfile<K extends keyof UserProfile>(field: K, value: UserProfile[K]) {
    onChange({ profile: { ...profile, [field]: value } });
  }

  function updateExperiences(experiences: Experience[]) {
    updateProfile('experiences', experiences);
  }

  function updateEducations(educations: Education[]) {
    updateProfile('educations', educations);
  }

  return {
    profile,
    isValid: validation.success,
    errorFor,
    updateProfile,
    updateExperiences,
    updateEducations,
  };
}
