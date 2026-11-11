import { z } from 'zod';

export const signupConfirmSchema = z.object({
  name: z.string().trim().min(1, 'Enter your name.'),
  email: z.string().trim().min(1, 'Enter your email address.').email('Enter a valid email address.'),
  password: z.string().min(8, 'Use at least 8 characters.'),
});

export type SignupConfirmFormValues = z.infer<typeof signupConfirmSchema>;
