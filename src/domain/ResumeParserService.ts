import type { UserProfile } from '@/domain/types';

export interface ResumeParserService {
  parseResume(file: File): Promise<UserProfile>;
}
