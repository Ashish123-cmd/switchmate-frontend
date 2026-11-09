import type { AuthService } from '@/domain/AuthService';
import { delay, readStorage, storageKeys, writeStorage } from '@/services/storage';

export class MockAuthService implements AuthService {
  async getCurrentUser(): Promise<string | null> {
    await delay();
    return readStorage<string | null>(storageKeys.currentUser, null);
  }

  async signIn(email: string, _password: string): Promise<void> {
    await delay();
    writeStorage(storageKeys.currentUser, email);
  }

  async signUp(_name: string, email: string, _password: string): Promise<void> {
    await delay();
    writeStorage(storageKeys.currentUser, email);
  }

  async signOut(): Promise<void> {
    await delay();
    window.localStorage.removeItem(storageKeys.currentUser);
  }
}
