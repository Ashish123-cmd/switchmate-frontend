import { z } from 'zod';

export const preferencesSchema = z
  .object({
    roles: z.array(z.string().trim().min(1)).min(1, 'Add at least one target role.'),
    locations: z.array(z.string().trim().min(1)).min(1, 'Add at least one location.'),
    minExperience: z.number().positive('Enter a positive minimum experience.'),
    maxExperience: z.number().positive('Enter a positive maximum experience.'),
    noticePeriodDays: z.number().int().positive('Enter a positive notice period.'),
    expectedCtcLpa: z.number().positive('Enter a positive expected CTC.'),
    workAuthorization: z.enum(['authorized', 'requires-sponsorship', 'other'], {
      errorMap: () => ({ message: 'Select your work authorization.' }),
    }),
    openToRelocation: z.boolean(),
  })
  .refine((preferences) => preferences.minExperience <= preferences.maxExperience, {
    message: 'Maximum experience must be at least the minimum.',
    path: ['maxExperience'],
  });
