import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/AuthContext';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { FormField } from '@/shared/ui/FormField';
import { Input } from '@/shared/ui/Input';
import { signupSchema, type SignupFormValues } from '@/features/auth/schemas/signupSchema';
import { zodResolver } from '@/features/auth/lib/zodResolver';

export function SignupPage() {
  const [serviceError, setServiceError] = useState<string | null>(null);
  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
  });

  async function onSubmit(values: SignupFormValues) {
    setServiceError(null);
    try {
      await signup(values.name, values.email, values.password);
      navigate('/onboarding', { replace: true });
    } catch (error) {
      setServiceError(
        error instanceof Error && error.message
          ? error.message
          : 'Unable to create your account. Please try again.',
      );
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-10">
      <Card className="w-full max-w-md space-y-6 p-7">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-emerald-800">Switchmate</p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Create your account
          </h1>
        </div>
        <form className="space-y-4" noValidate onSubmit={handleSubmit(onSubmit)}>
          <FormField error={errors.name?.message} id="signup-name" label="Full name">
            <Input
              autoComplete="name"
              id="signup-name"
              type="text"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'signup-name-error' : undefined}
              {...register('name')}
            />
          </FormField>
          <FormField error={errors.email?.message} id="signup-email" label="Email address">
            <Input
              autoComplete="email"
              id="signup-email"
              type="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'signup-email-error' : undefined}
              {...register('email')}
            />
          </FormField>
          <FormField error={errors.password?.message} id="signup-password" label="Password">
            <Input
              autoComplete="new-password"
              id="signup-password"
              type="password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'signup-password-error' : undefined}
              {...register('password')}
            />
          </FormField>
          <FormField
            error={errors.confirmPassword?.message}
            id="signup-confirm-password"
            label="Confirm password"
          >
            <Input
              autoComplete="new-password"
              id="signup-confirm-password"
              type="password"
              aria-invalid={Boolean(errors.confirmPassword)}
              aria-describedby={
                errors.confirmPassword ? 'signup-confirm-password-error' : undefined
              }
              {...register('confirmPassword')}
            />
          </FormField>
          {serviceError && (
            <p className="text-sm text-red-700" role="alert">
              {serviceError}
            </p>
          )}
          <Button className="w-full" disabled={isSubmitting || isLoading} type="submit">
            {isSubmitting || isLoading ? 'Creating account...' : 'Sign up'}
          </Button>
        </form>
        <p className="text-sm text-slate-600">
          Already have an account?{' '}
          <Link className="font-medium text-emerald-800 hover:underline" to="/login">
            Log in
          </Link>
        </p>
      </Card>
    </main>
  );
}
