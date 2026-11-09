import type { Job, JobFilters, MatchedJob, UserProfile } from '@/domain/types';

export interface JobService {
  listMatchedJobs(profile: UserProfile, filters?: JobFilters): Promise<MatchedJob[]>;
  getJobById(id: string): Promise<Job | null>;
  getMatchedJobById(id: string, profile: UserProfile): Promise<MatchedJob | null>;
  getSavedJobIds(): Promise<string[]>;
  getHiddenJobIds(): Promise<string[]>;
  saveJob(id: string): Promise<void>;
  hideJob(id: string): Promise<void>;
}
