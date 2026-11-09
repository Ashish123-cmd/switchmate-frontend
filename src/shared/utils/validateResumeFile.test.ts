import { describe, expect, it } from 'vitest';
import { MAX_RESUME_FILE_SIZE_BYTES, validateResumeFile } from '@/shared/utils/validateResumeFile';

function file(name: string, size: number): Pick<File, 'name' | 'size'> {
  return { name, size };
}

describe('validateResumeFile', () => {
  it('accepts PDF and DOCX extensions regardless of case', () => {
    expect(validateResumeFile(file('resume.pdf', 1024))).toBeNull();
    expect(validateResumeFile(file('resume.DOCX', 1024))).toBeNull();
  });

  it('rejects file types other than PDF and DOCX', () => {
    expect(validateResumeFile(file('resume.txt', 1024))).toBe('Choose a PDF or DOCX file.');
  });

  it('accepts a file at the 5 MB limit', () => {
    expect(validateResumeFile(file('resume.pdf', MAX_RESUME_FILE_SIZE_BYTES))).toBeNull();
  });

  it('rejects files larger than 5 MB', () => {
    expect(validateResumeFile(file('resume.docx', MAX_RESUME_FILE_SIZE_BYTES + 1))).toBe(
      'File must be 5 MB or smaller.',
    );
  });
});
