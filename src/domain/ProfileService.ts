import type { JobPreferences, StandardAnswers, UserProfile } from '@/domain/types';

export interface ProfileService {
  getProfile(): Promise<UserProfile>;
  getPreferences(): Promise<JobPreferences>;
  getStandardAnswers(): Promise<StandardAnswers>;
  saveProfile(profile: UserProfile): Promise<void>;
  savePreferences(preferences: JobPreferences): Promise<void>;
  saveStandardAnswers(answers: StandardAnswers): Promise<void>;
}
