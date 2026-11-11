import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/AuthContext';

export function useGoogleSignIn() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  async function handleCredential(credential: string): Promise<void> {
    setError(null);
    setIsLoading(true);

    try {
      const profileComplete = await signInWithGoogle(credential);

      if (profileComplete) {
        navigate('/jobs', { replace: true });
      } else {
        navigate('/onboarding', { replace: true });
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('popup_closed_by_user') || err.message.includes('access_denied')) {
          setError('Sign-in was cancelled. Please try again.');
        } else if (err.message.includes('verification_failed') || err.message.includes('invalid_credential')) {
          setError('Google sign-in verification failed. Please try again.');
        } else {
          setError(err.message);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return {
    handleCredential,
    error,
    isLoading,
  };
}
