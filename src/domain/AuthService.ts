export interface AuthService {
  getCurrentUser(): Promise<string | null>;
  signIn(email: string, password: string): Promise<void>;
  signUp(name: string, email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
}
