import { describe, expect, it } from 'vitest';
import type { StandardAnswers } from '@/domain/types';
import { standardAnswersSchema } from '@/features/onboarding/schemas/standardAnswersSchema';

const validAnswers: StandardAnswers = {
  requiresSponsorship: false,
  willingToRelocate: true,
  linkedinUrl: 'https://linkedin.com/in/example',
  githubUrl: '',
  portfolioUrl: 'https://example.com',
  customAnswers: { 'Why this role?': 'It fits my experience.' },
};

describe('standardAnswersSchema', () => {
  it('accepts explicit choices, valid URLs, and custom answers', () => {
    expect(standardAnswersSchema.safeParse(validAnswers).success).toBe(true);
  });

  it('requires an explicit sponsorship choice', () => {
    expect(
      standardAnswersSchema.safeParse({ ...validAnswers, requiresSponsorship: null }).success,
    ).toBe(false);
  });

  it('allows blank optional URLs and rejects malformed URLs', () => {
    expect(
      standardAnswersSchema.safeParse({
        ...validAnswers,
        linkedinUrl: '',
        githubUrl: '',
        portfolioUrl: '',
      }).success,
    ).toBe(true);
    expect(
      standardAnswersSchema.safeParse({ ...validAnswers, githubUrl: 'not-a-url' }).success,
    ).toBe(false);
  });
});
