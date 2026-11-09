import type { ApplicationService } from '@/domain/ApplicationService';
import type { Application, ApplicationStatus } from '@/domain/types';
import { delay, readStorage, storageKeys, writeStorage } from '@/services/storage';

export class MockApplicationService implements ApplicationService {
  async listApplications(): Promise<Application[]> {
    await delay();
    return readStorage<Application[]>(storageKeys.applications, []);
  }

  async createApplication(
    jobId: string,
    mode: Application['mode'],
    status: ApplicationStatus = 'queued',
  ): Promise<Application> {
    await delay();
    const applications = readStorage<Application[]>(storageKeys.applications, []);
    const application: Application = {
      id: crypto.randomUUID(),
      jobId,
      status,
      mode,
      updatedAt: new Date().toISOString(),
    };
    applications.push(application);
    writeStorage(storageKeys.applications, applications);
    return application;
  }

  async updateStatus(id: string, status: ApplicationStatus): Promise<Application | null> {
    await delay();
    const applications = readStorage<Application[]>(storageKeys.applications, []);
    const application = applications.find((item) => item.id === id);
    if (!application) return null;
    application.status = status;
    application.updatedAt = new Date().toISOString();
    writeStorage(storageKeys.applications, applications);
    return application;
  }

  async removeApplication(id: string): Promise<void> {
    await delay();
    const applications = readStorage<Application[]>(storageKeys.applications, []);
    writeStorage(
      storageKeys.applications,
      applications.filter((application) => application.id !== id),
    );
  }
}
