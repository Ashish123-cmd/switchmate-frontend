import { useRef, useState } from 'react';
import { useServices } from '@/app/ServicesProvider';
import type { WizardData } from '@/features/onboarding/types';
import { validateResumeFile } from '@/shared/utils/validateResumeFile';

interface UseResumeUploadOptions {
  data: WizardData;
  onChange: (updates: Partial<WizardData>) => void;
}

export function useResumeUpload({ data, onChange }: UseResumeUploadOptions) {
  const { resumeParser } = useServices();
  const [validationError, setValidationError] = useState<string | null>(null);
  const requestId = useRef(0);

  async function parseFile(file: File) {
    const currentRequestId = ++requestId.current;
    setValidationError(null);
    onChange({ resumeUpload: { file, status: 'parsing', error: null } });

    try {
      const parsedProfile = await resumeParser.parseResume(file);
      if (currentRequestId !== requestId.current) return;
      onChange({
        profile: {
          ...parsedProfile,
          email: data.profile.email,
          resume: { fileName: file.name, uploadedAt: new Date().toISOString() },
        },
        resumeUpload: { file, status: 'success', error: null },
      });
    } catch (error) {
      if (currentRequestId !== requestId.current) return;
      onChange({
        resumeUpload: {
          file,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unable to parse this resume. Try again.',
        },
      });
    }
  }

  function selectFile(file: File) {
    const error = validateResumeFile(file);
    setValidationError(error);
    if (error) return;
    void parseFile(file);
  }

  function retry() {
    if (data.resumeUpload.file) void parseFile(data.resumeUpload.file);
  }

  return { validationError, selectFile, retry };
}
