import type { AuthService } from '@/domain/AuthService';
import type { AuthSession, AuthUser, GoogleAuthSession, ResumeDraft, UserProfile } from '@/domain/types';
import { sampleProfile } from '@/services/sampleProfile';
import { delay, readStorage, storageKeys, writeStorage } from '@/services/storage';

function storedProfile(): UserProfile {
  return readStorage<UserProfile>(storageKeys.profile, sampleProfile);
}

function toAuthUser(email: string, name: string): AuthUser {
  return {
    id: `mock-user-${email}`,
    name,
    email,
    profile: { onboardingCompleted: storedProfile().onboardingCompleted === true },
  };
}

function toSession(email: string, name: string): AuthSession {
  return { token: `mock-token-${email}`, user: toAuthUser(email, name) };
}

export class MockAuthService implements AuthService {
  async getCurrentUser(): Promise<AuthUser | null> {
    await delay();
    const email = readStorage<string | null>(storageKeys.currentUser, null);
    if (!email) return null;
    return toAuthUser(email, storedProfile().fullName);
  }

  async signIn(email: string, _password: string): Promise<AuthSession> {
    await delay();
    writeStorage(storageKeys.currentUser, email);
    return toSession(email, storedProfile().fullName);
  }

  async signOut(): Promise<void> {
    await delay();
    window.localStorage.removeItem(storageKeys.currentUser);
    window.localStorage.removeItem(storageKeys.authToken);
  }

  async signInWithGoogle(credential: string): Promise<GoogleAuthSession> {
    await delay();
    const email = credential === 'demo-credential' ? 'demo@google.com' : 'google-user@example.com';
    writeStorage(storageKeys.currentUser, email);
    return { ...toSession(email, 'Google User'), isNewUser: true };
  }

  async parseResumeForSignup(_file: File): Promise<ResumeDraft> {
    await delay();
    return {
      draftId: crypto.randomUUID(),
      expiresAt: new Date(Date.now() + 30 * 60_000).toISOString(),
      parsedProfile: {
        name: sampleProfile.fullName,
        phone: sampleProfile.phone,
        location: sampleProfile.location,
        headline: sampleProfile.headline,
        summary: sampleProfile.summary,
        totalExperienceYears: sampleProfile.totalExperienceYears,
        skills: sampleProfile.skills,
        experiences: sampleProfile.experiences.map((experience) => ({
          company: experience.company,
          title: experience.title,
          startDate: experience.startDate,
          endDate: experience.endDate,
          description: experience.description,
        })),
        educations: sampleProfile.educations.map((education) => ({
          institution: education.institution,
          degree: education.degree,
          field: education.field,
          startYear: education.startYear,
          endYear: education.endYear,
        })),
      },
    };
  }

  async completeSignup(_draftId: string, name: string, email: string, _password: string): Promise<AuthSession> {
    await delay();
    writeStorage(storageKeys.currentUser, email);
    return toSession(email, name);
  }
}
