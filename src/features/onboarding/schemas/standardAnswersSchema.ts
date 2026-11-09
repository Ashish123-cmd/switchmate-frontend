import { z } from 'zod';

const optionalUrl = z
  .string()
  .trim()
  .refine(
    (value) => value === '' || z.string().url().safeParse(value).success,
    'Enter a valid URL.',
  );

export const customAnswerSchema = z.object({
  id: z.string().min(1),
  question: z.string().trim().min(1, 'Enter a question.'),
  answer: z.string().trim().min(1, 'Enter an answer.'),
});

export const standardAnswersSchema = z.object({
  requiresSponsorship: z.boolean({
    required_error: 'Choose yes or no.',
    invalid_type_error: 'Choose yes or no.',
  }),
  willingToRelocate: z.boolean({
    required_error: 'Choose yes or no.',
    invalid_type_error: 'Choose yes or no.',
  }),
  linkedinUrl: optionalUrl,
  githubUrl: optionalUrl,
  portfolioUrl: optionalUrl,
  customAnswers: z.record(z.string().trim().min(1), z.string().trim().min(1)),
});
