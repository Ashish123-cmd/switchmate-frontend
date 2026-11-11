import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useServices } from '@/app/ServicesProvider';
import { GoogleSignInButton } from '@/features/auth/components/GoogleSignInButton';
import { useGoogleSignIn } from '@/features/auth/hooks/useGoogleSignIn';
import { useSignupDraft } from '@/features/auth/context/SignupDraftContext';
import { toUserProfile } from '@/features/auth/lib/toUserProfile';
import { FileDropzone } from '@/shared/components/FileDropzone';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { validateResumeFile } from '@/shared/utils/validateResumeFile';

export function SignupPage() {
  const { auth } = useServices();
  const { setDraft } = useSignupDraft();
  const { handleCredential, error: googleError, isLoading: googleLoading } = useGoogleSignIn();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'parsing' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function parse(selectedFile: File) {
    const validationError = validateResumeFile(selectedFile);
    setFile(selectedFile);
    if (validationError) {
      setStatus('error');
      setError(validationError);
      return;
    }

    setStatus('parsing');
    setError(null);
    try {
      const draft = await auth.parseResumeForSignup(selectedFile);
      setDraft({
        draftId: draft.draftId,
        parsedProfile: toUserProfile(draft.parsedProfile, selectedFile),
      });
      navigate('/signup/confirm');
    } catch (parseError) {
      setStatus('error');
      setError(
        parseError instanceof Error && parseError.message
          ? parseError.message
          : 'Unable to read your resume. Please try again.',
      );
    }
  }

  function handleFileSelect(selectedFile: File) {
    void parse(selectedFile);
  }

  function retry() {
    if (file) void parse(file);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-10">
      <Card className="w-full max-w-md space-y-6 p-7">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-emerald-800">Switchmate</p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Create your account</h1>
          <p className="text-sm text-slate-600">Choose how you want to get started.</p>
        </div>

        <div className="space-y-3">
          <GoogleSignInButton onCredential={handleCredential} disabled={googleLoading} />
          {googleError && (
            <p className="text-sm text-red-700" role="alert">
              {googleError}
            </p>
          )}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-slate-500">Or continue with resume</span>
            </div>
          </div>

          <FileDropzone
            ariaLabel="Choose a resume file"
            disabled={status === 'parsing'}
            file={file}
            onFileSelect={handleFileSelect}
          />
        </div>

        {status === 'parsing' && (
          <p aria-live="polite" className="text-sm text-slate-600" role="status">
            Reading your resume...
          </p>
        )}

        {status === 'error' && error && (
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm text-red-700" role="alert">
              {error}
            </p>
            <Button onClick={retry} type="button" variant="secondary">
              Retry
            </Button>
          </div>
        )}

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
