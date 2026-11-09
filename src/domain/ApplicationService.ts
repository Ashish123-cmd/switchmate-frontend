import type { Application, ApplicationStatus } from '@/domain/types';

export interface ApplicationService {
  listApplications(): Promise<Application[]>;
  createApplication(
    jobId: string,
    mode: Application['mode'],
    status?: ApplicationStatus,
  ): Promise<Application>;
  updateStatus(id: string, status: ApplicationStatus): Promise<Application | null>;
  removeApplication(id: string): Promise<void>;
}
