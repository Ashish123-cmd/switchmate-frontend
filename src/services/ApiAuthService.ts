import type { AuthService } from '@/domain/AuthService';
import type { AuthSession, AuthUser, GoogleAuthSession, ResumeDraft } from '@/domain/types';
import { ApiClient, ApiError } from '@/services/api/ApiClient';

/**
 * Implements the F1 auth contract against the Spring Boot backend:
 * POST /api/auth/login, POST /api/auth/google, POST /api/auth/signup/resume,
 * POST /api/auth/signup/complete, and GET /api/auth/me.
 */
export class ApiAuthService implements AuthService {
  constructor(private readonly api: ApiClient) {}

  async getCurrentUser(): Promise<AuthUser | null> {
    if (!this.api.getToken()) return null;
    try {
      return await this.api.get<AuthUser>('/api/auth/me');
    } catch (error) {
      if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
        this.api.clearToken();
        return null;
      }
      throw error;
    }
  }

  async signIn(email: string, password: string): Promise<AuthSession> {
    const session = await this.api.post<AuthSession>('/api/auth/login', { email, password });
    this.api.setToken(session.token);
    return session;
  }

  async signOut(): Promise<void> {
    this.api.clearToken();
  }

  async signInWithGoogle(credential: string): Promise<GoogleAuthSession> {
    const session = await this.api.post<GoogleAuthSession>('/api/auth/google', { idToken: credential });
    this.api.setToken(session.token);
    return session;
  }

  async parseResumeForSignup(file: File): Promise<ResumeDraft> {
    const formData = new FormData();
    formData.append('file', file);
    return this.api.postForm<ResumeDraft>('/api/auth/signup/resume', formData);
  }

  async completeSignup(
    draftId: string,
    name: string,
    email: string,
    password: string,
  ): Promise<AuthSession> {
    const session = await this.api.post<AuthSession>('/api/auth/signup/complete', {
      draftId,
      name,
      email,
      password,
    });
    this.api.setToken(session.token);
    return session;
  }
}
