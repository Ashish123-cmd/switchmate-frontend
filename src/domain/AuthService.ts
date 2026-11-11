import type { AuthSession, AuthUser, GoogleAuthSession, ResumeDraft } from '@/domain/types';

export interface AuthService {
  getCurrentUser(): Promise<AuthUser | null>;
  signIn(email: string, password: string): Promise<AuthSession>;
  signOut(): Promise<void>;
  signInWithGoogle(credential: string): Promise<GoogleAuthSession>;
  parseResumeForSignup(file: File): Promise<ResumeDraft>;
  completeSignup(draftId: string, name: string, email: string, password: string): Promise<AuthSession>;
}
