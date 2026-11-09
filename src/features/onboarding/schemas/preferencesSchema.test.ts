import { describe, expect, it } from 'vitest';
import type { JobPreferences } from '@/domain/types';
import { preferencesSchema } from '@/features/onboarding/schemas/preferencesSchema';

const validPreferences: JobPreferences = {
  roles: ['Frontend Engineer'],
  locations: ['Remote'],
  minExperience: 2,
  maxExperience: 6,
  noticePeriodDays: 30,
  expectedCtcLpa: 18,
  workAuthorization: 'authorized',
  openToRelocation: false,
};

describe('preferencesSchema', () => {
  it('accepts valid preferences', () => {
    expect(preferencesSchema.safeParse(validPreferences).success).toBe(true);
  });

  it('rejects a minimum experience above the maximum', () => {
    const result = preferencesSchema.safeParse({ ...validPreferences, minExperience: 7 });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0]?.path).toEqual(['maxExperience']);
  });

  it('rejects non-positive numeric preferences', () => {
    expect(preferencesSchema.safeParse({ ...validPreferences, expectedCtcLpa: 0 }).success).toBe(
      false,
    );
    expect(preferencesSchema.safeParse({ ...validPreferences, noticePeriodDays: 0 }).success).toBe(
      false,
    );
  });
});
