export const MAX_RESUME_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export function validateResumeFile(file: Pick<File, 'name' | 'size'>): string | null {
  if (!/\.(pdf|docx)$/i.test(file.name)) return 'Choose a PDF or DOCX file.';
  if (file.size > MAX_RESUME_FILE_SIZE_BYTES) return 'File must be 5 MB or smaller.';
  return null;
}
