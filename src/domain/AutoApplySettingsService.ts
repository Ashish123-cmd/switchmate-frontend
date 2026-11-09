import type { AutoApplySettings } from '@/domain/types';

export interface AutoApplySettingsService {
  getSettings(): Promise<AutoApplySettings>;
  saveSettings(settings: AutoApplySettings): Promise<void>;
}
