import { describe, expect, it } from 'vitest';
import { classifyJobSkills } from '@/features/jobs/utils/classifyJobSkills';

describe('classifyJobSkills', () => {
  it('separates matched and missing skills without changing job skill labels', () => {
    expect(classifyJobSkills(['React', 'Go', 'TypeScript'], [' react ', 'typescript'])).toEqual({
      matched: ['React', 'TypeScript'],
      missing: ['Go'],
    });
  });

  it('returns all required skills as missing when the profile has none', () => {
    expect(classifyJobSkills(['Python', 'SQL'], [])).toEqual({
      matched: [],
      missing: ['Python', 'SQL'],
    });
  });
});
