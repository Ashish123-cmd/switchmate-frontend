import type { ResumeParserService } from '@/domain/ResumeParserService';
import type { UserProfile } from '@/domain/types';
import { delay } from '@/services/storage';
import { sampleProfile } from '@/services/sampleProfile';

export class MockResumeParserService implements ResumeParserService {
  async parseResume(_file: File): Promise<UserProfile> {
    await delay();
    return sampleProfile;
  }
}
