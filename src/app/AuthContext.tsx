import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { UserProfile } from '@/domain/types';
import { useServices } from '@/app/ServicesProvider';

interface AuthContextValue {
  currentUser: string | null;
  isProfileComplete: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfileStatus: () => Promise<boolean>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function profileIsComplete(profile: UserProfile, email: string): boolean {
  return (
    profile.email.trim().toLocaleLowerCase() === email.trim().toLocaleLowerCase() &&
    profile.fullName.trim().length > 0 &&
    profile.headline.trim().length > 0 &&
    profile.summary.trim().length > 0
  );
}

export function AuthProvider({ children }: AuthProviderProps) {
  const services = useServices();
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      try {
        const email = await services.auth.getCurrentUser();
        const profile = email ? await services.profile.getProfile() : null;
        if (!active) return;
        setCurrentUser(email);
        setIsProfileComplete(Boolean(email && profile && profileIsComplete(profile, email)));
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void restoreSession();
    return () => {
      active = false;
    };
  }, [services.auth, services.profile]);

  async function refreshProfileStatus(): Promise<boolean> {
    if (!currentUser) {
      setIsProfileComplete(false);
      return false;
    }
    const profile = await services.profile.getProfile();
    const complete = profileIsComplete(profile, currentUser);
    setIsProfileComplete(complete);
    return complete;
  }

  async function login(email: string, password: string): Promise<boolean> {
    setIsLoading(true);
    try {
      await services.auth.signIn(email, password);
      setCurrentUser(email);
      const profile = await services.profile.getProfile();
      const complete = profileIsComplete(profile, email);
      setIsProfileComplete(complete);
      return complete;
    } finally {
      setIsLoading(false);
    }
  }

  async function signup(name: string, email: string, password: string): Promise<void> {
    setIsLoading(true);
    try {
      await services.auth.signUp(name, email, password);
      setCurrentUser(email);
      setIsProfileComplete(false);
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
        signup,
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
