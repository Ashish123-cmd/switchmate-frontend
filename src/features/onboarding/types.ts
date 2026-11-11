import type { ComponentType } from 'react';
import type { JobPreferences, StandardAnswers, UserProfile } from '@/domain/types';

export type WizardStepId = string;

export interface ResumeUploadDraft {
  file: File | null;
  status: 'idle' | 'parsing' | 'success' | 'error';
  error: string | null;
}

export interface WizardData {
  profile: UserProfile;
  preferences: JobPreferences;
  standardAnswers: StandardAnswers;
  resumeUpload: ResumeUploadDraft;
}

export interface WizardStepProps {
  data: WizardData;
  onChange: (updates: Partial<WizardData>) => void;
  onNext?: () => void;
  onBack?: () => void;
  isFirst?: boolean;
  isSubmitting?: boolean;
  showNavigation?: boolean;
  showResumeBanner?: boolean;
  onValidationChange?: (isValid: boolean) => void;
}

export interface WizardStepConfig {
  id: WizardStepId;
  title: string;
  component: ComponentType<WizardStepProps>;
  isSkipped?: (profile: UserProfile) => boolean;
}
