import { ProfileStep } from '@/features/onboarding/components/ProfileStep';
import { PreferencesStep } from '@/features/onboarding/components/PreferencesStep';
import { ResumeStep } from '@/features/onboarding/components/ResumeStep';
import { StandardAnswersStep } from '@/features/onboarding/components/StandardAnswersStep';
import type { WizardStepConfig } from '@/features/onboarding/types';

export const wizardSteps: WizardStepConfig[] = [
  { id: 'resume', title: 'Resume', component: ResumeStep },
  { id: 'profile', title: 'Profile', component: ProfileStep },
  { id: 'preferences', title: 'Preferences', component: PreferencesStep },
  { id: 'standard-answers', title: 'Standard Answers', component: StandardAnswersStep },
];
