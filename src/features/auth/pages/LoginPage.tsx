import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/AuthContext';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { FormField } from '@/shared/ui/FormField';
import { Input } from '@/shared/ui/Input';
import { loginSchema, type LoginFormValues } from '@/features/auth/schemas/loginSchema';
import { zodResolver } from '@/features/auth/lib/zodResolver';

export function LoginPage() {
  const [serviceError, setServiceError] = useState<string | null>(null);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  async function onSubmit(values: LoginFormValues) {
    setServiceError(null);
    try {
      const profileComplete = await login(values.email, values.password);
      navigate(profileComplete ? '/jobs' : '/onboarding', { replace: true });
    } catch (error) {
      setServiceError(
        error instanceof Error && error.message
          ? error.message
          : 'Unable to log in. Please try again.',
      );
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-10">
      <Card className="w-full max-w-md space-y-6 p-7">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-emerald-800">Switchmate</p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Welcome back</h1>
        </div>
        <form className="space-y-4" noValidate onSubmit={handleSubmit(onSubmit)}>
          <FormField error={errors.email?.message} id="login-email" label="Email address">
            <Input
              autoComplete="email"
              id="login-email"
              type="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'login-email-error' : undefined}
              {...register('email')}
            />
          </FormField>
          <FormField error={errors.password?.message} id="login-password" label="Password">
            <Input
              autoComplete="current-password"
              id="login-password"
              type="password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'login-password-error' : undefined}
              {...register('password')}
            />
          </FormField>
          {serviceError && (
            <p className="text-sm text-red-700" role="alert">
              {serviceError}
            </p>
          )}
          <Button className="w-full" disabled={isSubmitting || isLoading} type="submit">
            {isSubmitting || isLoading ? 'Logging in...' : 'Log in'}
          </Button>
        </form>
        <p className="text-sm text-slate-600">
          New to Switchmate?{' '}
          <Link className="font-medium text-emerald-800 hover:underline" to="/signup">
            Create an account
          </Link>
        </p>
      </Card>
    </main>
  );
}
