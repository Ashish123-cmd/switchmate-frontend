import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/AuthContext';
import { PasswordSuggestion } from '@/features/auth/components/PasswordSuggestion';
import { useSignupDraft } from '@/features/auth/context/SignupDraftContext';
import { zodResolver } from '@/features/auth/lib/zodResolver';
import {
  signupConfirmSchema,
  type SignupConfirmFormValues,
} from '@/features/auth/schemas/signupConfirmSchema';
import { ApiError } from '@/services/api/ApiClient';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { FormField } from '@/shared/ui/FormField';
import { Input } from '@/shared/ui/Input';
import { PasswordField } from '@/shared/ui/PasswordField';

export function SignupConfirmPage() {
  const { completeSignup } = useAuth();
  const { draft, clearDraft } = useSignupDraft();
  const navigate = useNavigate();
  const [serviceError, setServiceError] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [passwordRevealed, setPasswordRevealed] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignupConfirmFormValues>({
    resolver: zodResolver(signupConfirmSchema),
    mode: 'onBlur',
    defaultValues: { name: '', email: '', password: '' },
  });

  useEffect(() => {
    if (!draft) {
      navigate('/signup', { replace: true });
      return;
    }
    reset({
      name: draft.parsedProfile.fullName ?? '',
      email: draft.parsedProfile.email ?? '',
      password: '',
    });
  }, [draft, navigate, reset]);

  if (!draft) return null;

  async function onSubmit(values: SignupConfirmFormValues) {
    if (!draft) return;
    setServiceError(null);
    setSessionExpired(false);
    try {
      await completeSignup(draft.draftId, values.name.trim(), values.email.trim(), values.password);
      clearDraft();
      navigate('/onboarding', { replace: true });
    } catch (error) {
      if (error instanceof ApiError) {
        const code = error.code?.toUpperCase() ?? '';
        const message = error.message.toLowerCase();
        if (error.status === 409 || code.includes('CONFLICT') || message.includes('email already registered')) {
          setServiceError('email already registered');
          return;
        }
        if (
          error.status === 404 ||
          error.status === 410 ||
          code.includes('DRAFT') ||
          code.includes('EXPIRED') ||
          message.includes('draft') ||
          message.includes('expired') ||
          message.includes('not found')
        ) {
          setSessionExpired(true);
          return;
        }
      }
      if (error instanceof Error && error.message.toLowerCase().includes('email already registered')) {
        setServiceError('email already registered');
        return;
      }
      setServiceError(
        error instanceof Error && error.message
          ? error.message
          : 'Unable to complete sign up. Please try again.',
      );
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-10">
      <Card className="w-full max-w-md space-y-6 p-7">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-emerald-800">Switchmate</p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Almost done, confirm your details
          </h1>
        </div>

        <form className="space-y-4" noValidate onSubmit={handleSubmit(onSubmit)}>
          <FormField error={errors.name?.message} id="confirm-name" label="Full name">
            <Input
              autoComplete="name"
              id="confirm-name"
              type="text"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'confirm-name-error' : undefined}
              {...register('name')}
            />
          </FormField>

          <FormField error={errors.email?.message} id="confirm-email" label="Email address">
            <Input
              autoComplete="email"
              id="confirm-email"
              type="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'confirm-email-error' : undefined}
              {...register('email')}
            />
          </FormField>

          <FormField error={errors.password?.message} id="confirm-password" label="Password">
            <PasswordField
              autoComplete="new-password"
              id="confirm-password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'confirm-password-error' : undefined}
              onRevealedChange={setPasswordRevealed}
              revealed={passwordRevealed}
              {...register('password')}
            />
          </FormField>

          <PasswordSuggestion
            disabled={isSubmitting}
            onUse={(password) => {
              setValue('password', password, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
              setPasswordRevealed(true);
            }}
          />

          {sessionExpired && (
            <p className="text-sm text-red-700" role="alert">
              session expired, please upload again{' '}
              <Link className="font-medium underline" to="/signup">
                Upload again
              </Link>
            </p>
          )}

          {serviceError && (
            <p className="text-sm text-red-700" role="alert">
              {serviceError}
            </p>
          )}

          <Button className="w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Confirming...' : 'Confirm and continue'}
          </Button>
        </form>
      </Card>
    </main>
  );
}
