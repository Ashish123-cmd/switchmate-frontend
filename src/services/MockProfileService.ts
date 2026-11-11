import type { ProfileService } from '@/domain/ProfileService';
import type { JobPreferences, StandardAnswers, UserProfile } from '@/domain/types';
import { delay, readStorage, storageKeys, writeStorage } from '@/services/storage';
import { sampleProfile } from '@/services/sampleProfile';

const defaultStandardAnswers: StandardAnswers = {
  requiresSponsorship: null,
  willingToRelocate: null,
  linkedinUrl: '',
  githubUrl: '',
  portfolioUrl: '',
  customAnswers: {},
};

const defaultPreferences: JobPreferences = {
  roles: [],
  locations: [],
  minExperience: 0,
  maxExperience: 0,
  noticePeriodDays: 0,
  expectedCtcLpa: 0,
  workAuthorization: '',
  openToRelocation: false,
};

export class MockProfileService implements ProfileService {
  async getProfile(): Promise<UserProfile> {
    await delay();
    return readStorage(storageKeys.profile, sampleProfile);
  }

  async getStandardAnswers(): Promise<StandardAnswers> {
    await delay();
    return readStorage(storageKeys.standardAnswers, defaultStandardAnswers);
  }

  async getPreferences(): Promise<JobPreferences> {
    await delay();
    return readStorage(storageKeys.preferences, defaultPreferences);
  }

  async saveProfile(profile: UserProfile): Promise<void> {
    await delay();
    writeStorage(storageKeys.profile, profile);
  }

  async savePreferences(preferences: JobPreferences): Promise<void> {
    await delay();
    writeStorage(storageKeys.preferences, preferences);
  }

  async saveStandardAnswers(answers: StandardAnswers): Promise<void> {
    await delay();
    writeStorage(storageKeys.standardAnswers, answers);
  }

  async completeProfile(): Promise<void> {
    const profile = await this.getProfile();
    writeStorage(storageKeys.profile, { ...profile, onboardingCompleted: true });
  }
}
