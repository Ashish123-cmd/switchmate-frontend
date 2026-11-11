import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { Button } from '@/shared/ui/Button';

const megabyte = 1024 * 1024;

function formatFileSize(bytes: number): string {
  return bytes >= megabyte
    ? `${(bytes / megabyte).toFixed(2)} MB`
    : `${(bytes / 1024).toFixed(0)} KB`;
}

export interface FileDropzoneProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  disabled?: boolean;
  accept?: string;
  ariaLabel?: string;
  hint?: string;
  chooseLabel?: string;
  replaceLabel?: string;
  dropLabel?: string;
  selectedLabel?: string;
}

const defaultAccept =
  '.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document';

export function FileDropzone({
  file,
  onFileSelect,
  disabled = false,
  accept = defaultAccept,
  ariaLabel = 'Choose a file',
  hint = 'PDF or DOCX, up to 5 MB.',
  chooseLabel = 'Choose file',
  replaceLabel = 'Replace file',
  dropLabel = 'Drag and drop your resume here',
  selectedLabel = 'Resume selected',
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (selectedFile) onFileSelect(selectedFile);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) onFileSelect(droppedFile);
  }

  return (
    <div className="space-y-3">
      <input
        accept={accept}
        aria-label={ariaLabel}
        className="sr-only"
        disabled={disabled}
        onChange={handleFileChange}
        ref={inputRef}
        type="file"
      />
      <div
        className={`space-y-3 rounded border border-dashed px-5 py-8 text-center ${
          isDragging ? 'border-emerald-800 bg-emerald-50' : 'border-slate-300 bg-slate-50'
        } ${disabled ? 'opacity-70' : ''}`}
        onDragEnter={(event) => {
          event.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        role="presentation"
      >
        <p className="text-sm font-medium text-slate-800">{file ? selectedLabel : dropLabel}</p>
        <Button
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          type="button"
          variant="secondary"
        >
          {file ? replaceLabel : chooseLabel}
        </Button>
        <p className="text-xs text-slate-500">{hint}</p>
      </div>

      {file && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded bg-slate-50 px-4 py-3 text-sm">
          <span className="break-all font-medium text-slate-800">{file.name}</span>
          <span className="text-slate-600">{formatFileSize(file.size)}</span>
        </div>
      )}
    </div>
  );
}
