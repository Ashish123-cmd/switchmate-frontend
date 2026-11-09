import { z } from 'zod';

export const experienceSchema = z
  .object({
    id: z.string().min(1),
    company: z.string().trim().min(1, 'Enter a company.'),
    title: z.string().trim().min(1, 'Enter a job title.'),
    startDate: z.string().min(1, 'Choose a start date.'),
    endDate: z.string().nullable(),
    description: z.string().trim().min(1, 'Enter a description.'),
  })
  .refine((experience) => !experience.endDate || experience.endDate >= experience.startDate, {
    message: 'End date must be on or after the start date.',
    path: ['endDate'],
  });

export const educationSchema = z
  .object({
    id: z.string().min(1),
    institution: z.string().trim().min(1, 'Enter an institution.'),
    degree: z.string().trim().min(1, 'Enter a degree.'),
    field: z.string().trim().min(1, 'Enter a field of study.'),
    startYear: z.number().int().min(1900, 'Enter a valid start year.').max(2100),
    endYear: z.number().int().min(1900, 'Enter a valid end year.').max(2100),
  })
  .refine((education) => education.endYear >= education.startYear, {
    message: 'End year must be on or after the start year.',
    path: ['endYear'],
  });

export const profileStepSchema = z.object({
  fullName: z.string().trim().min(1, 'Enter your full name.'),
  email: z.string().trim().email('Enter a valid email address.'),
  phone: z.string(),
  location: z.string(),
  headline: z.string().trim().min(1, 'Enter a professional headline.'),
  summary: z.string().trim().min(1, 'Enter a professional summary.'),
  totalExperienceYears: z.number().min(0, 'Experience cannot be negative.'),
  skills: z.array(z.string().trim().min(1)).min(1, 'Add at least one skill.'),
  experiences: z.array(experienceSchema),
  educations: z.array(educationSchema),
});
