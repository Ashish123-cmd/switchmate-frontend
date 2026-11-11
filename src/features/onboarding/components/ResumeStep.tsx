import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { FileDropzone } from '@/shared/components/FileDropzone';
import { useResumeUpload } from '@/features/onboarding/hooks/useResumeUpload';
import type { WizardStepProps } from '@/features/onboarding/types';

export function ResumeStep({
  data,
  onChange,
  onBack,
  onNext,
  isFirst,
  isSubmitting,
}: WizardStepProps) {
  const { validationError, selectFile, retry } = useResumeUpload({ data, onChange });
  const { file, status, error } = data.resumeUpload;

  return (
    <Card className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">Upload your resume</h2>
        <p className="text-sm text-slate-600">PDF or DOCX, up to 5 MB.</p>
      </div>

      <FileDropzone
        ariaLabel="Choose a resume file"
        disabled={status === 'parsing' || isSubmitting}
        file={file}
        onFileSelect={selectFile}
      />

      {validationError && (
        <p className="text-sm text-red-700" role="alert">
          {validationError}
        </p>
      )}
      {status === 'parsing' && (
        <p aria-live="polite" className="text-sm text-slate-600" role="status">
          Parsing your resume...
        </p>
      )}
      {status === 'success' && (
        <p className="text-sm text-emerald-800" role="status">
          Resume parsed and added to your profile.
        </p>
      )}
      {status === 'error' && (
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm text-red-700" role="alert">
            {error}
          </p>
          <Button onClick={retry} type="button" variant="secondary">
            Retry parsing
          </Button>
        </div>
      )}

      <div className="flex justify-between gap-3">
        <Button
          disabled={isFirst || isSubmitting}
          onClick={onBack}
          type="button"
          variant="secondary"
        >
          Back
        </Button>
        <Button
          disabled={status === 'parsing' || isSubmitting}
          onClick={onNext}
          type="button"
          variant={file && status === 'success' ? 'primary' : 'secondary'}
        >
          {file && status === 'success' ? 'Continue' : "Skip, I'll enter manually"}
        </Button>
      </div>
    </Card>
  );
}
