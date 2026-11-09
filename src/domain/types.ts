export interface Experience {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate: string | null;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear: number;
}

export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  headline: string;
  summary: string;
  totalExperienceYears: number;
  skills: string[];
  experiences: Experience[];
  educations: Education[];
  resume: { fileName: string; uploadedAt: string } | null;
}

export interface JobPreferences {
  roles: string[];
  locations: string[];
  minExperience: number;
  maxExperience: number;
  noticePeriodDays: number;
  expectedCtcLpa: number;
  workAuthorization: string;
  openToRelocation: boolean;
}

export interface StandardAnswers {
  requiresSponsorship: boolean | null;
  willingToRelocate: boolean | null;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  customAnswers: Record<string, string>;
}

export type JobSource = 'greenhouse' | 'lever' | 'ashby' | 'workday';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  source: JobSource;
  applyUrl: string;
  description: string;
  skills: string[];
  minExperience: number;
  maxExperience: number;
  postedAt: string;
}

export interface MatchedJob {
  job: Job;
  score: number;
  reasons: string[];
}

export interface JobFilters {
  query?: string;
  locations?: string[];
  sources?: JobSource[];
  skills?: string[];
  minExperience?: number;
  maxExperience?: number;
  minMatchScore?: number;
}

export type ApplicationStatus = 'saved' | 'queued' | 'applied' | 'interview' | 'rejected';

export interface Application {
  id: string;
  jobId: string;
  status: ApplicationStatus;
  mode: 'manual' | 'auto';
  updatedAt: string;
}

export interface AutoApplySettings {
  enabled: boolean;
  minMatchScore: number;
  dailyCap: number;
  excludedCompanies: string[];
  requireApproval: boolean;
}
