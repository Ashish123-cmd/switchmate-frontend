import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { AuthSession } from '@/domain/types';
import { useServices } from '@/app/ServicesProvider';

interface AuthContextValue {
  currentUser: string | null;
  isProfileComplete: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signInWithGoogle: (credential: string) => Promise<boolean>;
  completeSignup: (draftId: string, name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshProfileStatus: () => Promise<boolean>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: AuthProviderProps) {
  const services = useServices();
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * The auth API reports onboarding state, but the profile endpoint is still
   * served by the in-browser mock. Fall back to the profile service so the
   * onboarding flow keeps working until the profile API is wired up.
   */
  const resolveCompleteness = useCallback(
    async (sessionCompleted: boolean): Promise<boolean> => {
      if (sessionCompleted) return true;
      try {
        return (await services.profile.getProfile()).onboardingCompleted === true;
      } catch {
        return false;
      }
    },
    [services.profile],
  );

  async function applySession(session: AuthSession): Promise<boolean> {
    setCurrentUser(session.user.email);
    const complete = await resolveCompleteness(session.user.profile.onboardingCompleted);
    setIsProfileComplete(complete);
    return complete;
  }

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      try {
        const user = await services.auth.getCurrentUser();
        if (!active) return;
        if (!user) {
          setCurrentUser(null);
          setIsProfileComplete(false);
          return;
        }
        const complete = await resolveCompleteness(user.profile.onboardingCompleted);
        if (!active) return;
        setCurrentUser(user.email);
        setIsProfileComplete(complete);
      } catch {
        if (!active) return;
        await services.auth.signOut();
        setCurrentUser(null);
        setIsProfileComplete(false);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void restoreSession();
    return () => {
      active = false;
    };
  }, [services.auth, resolveCompleteness]);

  async function refreshProfileStatus(): Promise<boolean> {
    try {
      const user = await services.auth.getCurrentUser();
      if (!user) {
        setCurrentUser(null);
        setIsProfileComplete(false);
        return false;
      }
      const complete = await resolveCompleteness(user.profile.onboardingCompleted);
      setCurrentUser(user.email);
      setIsProfileComplete(complete);
      return complete;
    } catch {
      setCurrentUser(null);
      setIsProfileComplete(false);
      return false;
    }
  }

  async function login(email: string, password: string): Promise<boolean> {
    setIsLoading(true);
    try {
      return await applySession(await services.auth.signIn(email, password));
    } finally {
      setIsLoading(false);
    }
  }

  async function signInWithGoogle(credential: string): Promise<boolean> {
    setIsLoading(true);
    try {
      return await applySession(await services.auth.signInWithGoogle(credential));
    } finally {
      setIsLoading(false);
    }
  }

  async function completeSignup(
    draftId: string,
    name: string,
    email: string,
    password: string,
  ): Promise<boolean> {
    setIsLoading(true);
    try {
      return await applySession(await services.auth.completeSignup(draftId, name, email, password));
    } finally {
      setIsLoading(false);
    }
  }

  async function logout(): Promise<void> {
    setIsLoading(true);
    try {
      await services.auth.signOut();
      setCurrentUser(null);
      setIsProfileComplete(false);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isProfileComplete,
        isLoading,
        login,
        signInWithGoogle,
        completeSignup,
        logout,
        refreshProfileStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error('useAuth must be used within AuthProvider');
  return auth;
}
