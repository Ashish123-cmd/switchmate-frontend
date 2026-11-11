import { createContext, useContext, type ReactNode } from 'react';
import type { ApplicationService } from '@/domain/ApplicationService';
import type { AuthService } from '@/domain/AuthService';
import type { AutoApplySettingsService } from '@/domain/AutoApplySettingsService';
import type { JobService } from '@/domain/JobService';
import type { ProfileService } from '@/domain/ProfileService';
import type { ResumeParserService } from '@/domain/ResumeParserService';
import { ApiAuthService } from '@/services/ApiAuthService';
import { ApiClient } from '@/services/api/ApiClient';
import { MockApplicationService } from '@/services/MockApplicationService';
import { MockAuthService } from '@/services/MockAuthService';
import { MockAutoApplySettingsService } from '@/services/MockAutoApplySettingsService';
import { MockJobService } from '@/services/MockJobService';
import { MockProfileService } from '@/services/MockProfileService';
import { MockResumeParserService } from '@/services/MockResumeParserService';

export interface AppServices {
  auth: AuthService;
  profile: ProfileService;
  resumeParser: ResumeParserService;
  jobs: JobService;
  applications: ApplicationService;
  autoApplySettings: AutoApplySettingsService;
}

interface ServicesProviderProps {
  children: ReactNode;
  services?: AppServices;
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const defaultServices: AppServices = {
  // Auth talks to the Spring Boot backend when VITE_API_BASE_URL is configured;
  // without it the app falls back to the in-browser mock so the UI can run standalone.
  auth: apiBaseUrl ? new ApiAuthService(new ApiClient(apiBaseUrl)) : new MockAuthService(),
  profile: new MockProfileService(),
  resumeParser: new MockResumeParserService(),
  jobs: new MockJobService(),
  applications: new MockApplicationService(),
  autoApplySettings: new MockAutoApplySettingsService(),
};

const ServicesContext = createContext<AppServices | null>(null);

export function ServicesProvider({ children, services = defaultServices }: ServicesProviderProps) {
  return <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>;
}

export function useServices(): AppServices {
  const services = useContext(ServicesContext);
  if (!services) throw new Error('useServices must be used within ServicesProvider');
  return services;
}
