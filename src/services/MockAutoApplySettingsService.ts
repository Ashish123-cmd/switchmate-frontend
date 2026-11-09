import type { AutoApplySettings } from '@/domain/types';
import type { AutoApplySettingsService } from '@/domain/AutoApplySettingsService';
import { delay, readStorage, storageKeys, writeStorage } from '@/services/storage';
import { defaultAutoApplySettings } from '@/shared/config/defaultAutoApplySettings';

export class MockAutoApplySettingsService implements AutoApplySettingsService {
  async getSettings(): Promise<AutoApplySettings> {
    await delay();
    return readStorage(storageKeys.autoApplySettings, defaultAutoApplySettings);
  }

  async saveSettings(settings: AutoApplySettings): Promise<void> {
    await delay();
    writeStorage(storageKeys.autoApplySettings, settings);
  }
}
