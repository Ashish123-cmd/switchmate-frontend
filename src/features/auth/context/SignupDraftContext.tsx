import { createContext, useContext, useState, type ReactNode } from 'react';
import type { UserProfile } from '@/domain/types';

export interface SignupDraft {
  draftId: string;
  parsedProfile: UserProfile;
}

interface SignupDraftContextValue {
  draft: SignupDraft | null;
  setDraft: (draft: SignupDraft) => void;
  clearDraft: () => void;
}

const SignupDraftContext = createContext<SignupDraftContextValue | null>(null);

export function SignupDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraftState] = useState<SignupDraft | null>(null);

  return (
    <SignupDraftContext.Provider
      value={{
        draft,
        setDraft: (next) => setDraftState(next),
        clearDraft: () => setDraftState(null),
      }}
    >
      {children}
    </SignupDraftContext.Provider>
  );
}

export function useSignupDraft(): SignupDraftContextValue {
  const context = useContext(SignupDraftContext);
  if (!context) throw new Error('useSignupDraft must be used within SignupDraftProvider');
  return context;
}
