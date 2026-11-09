import { useRef, useState, type DragEvent, type ChangeEvent } from 'react';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { useResumeUpload } from '@/features/onboarding/hooks/useResumeUpload';
import type { WizardStepProps } from '@/features/onboarding/types';

const megabyte = 1024 * 1024;

function formatFileSize(bytes: number): string {
  return bytes >= megabyte
    ? `${(bytes / megabyte).toFixed(2)} MB`
    : `${(bytes / 1024).toFixed(0)} KB`;
}

export function ResumeStep({
  data,
  onChange,
  onBack,
  onNext,
  isFirst,
  isSubmitting,
}: WizardStepProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { validationError, selectFile, retry } = useResumeUpload({ data, onChange });
  const { file, status, error } = data.resumeUpload;

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (selectedFile) selectFile(selectedFile);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) selectFile(droppedFile);
  }

  return (
    <Card className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">Upload your resume</h2>
        <p className="text-sm text-slate-600">PDF or DOCX, up to 5 MB.</p>
      </div>

      <input
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        aria-label="Choose a resume file"
        className="sr-only"
        onChange={handleFileChange}
        ref={inputRef}
        type="file"
      />
      <div
        className={`space-y-3 rounded border border-dashed px-5 py-8 text-center ${
          isDragging ? 'border-emerald-800 bg-emerald-50' : 'border-slate-300 bg-slate-50'
        }`}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        role="presentation"
      >
        <p className="text-sm font-medium text-slate-800">
          {file ? 'Resume selected' : 'Drag and drop your resume here'}
        </p>
        <Button onClick={() => inputRef.current?.click()} type="button" variant="secondary">
          {file ? 'Replace file' : 'Choose file'}
        </Button>
      </div>

      {file && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded bg-slate-50 px-4 py-3 text-sm">
          <span className="break-all font-medium text-slate-800">{file.name}</span>
          <span className="text-slate-600">{formatFileSize(file.size)}</span>
        </div>
      )}
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
