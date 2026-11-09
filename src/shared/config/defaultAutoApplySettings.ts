import type { AutoApplySettings } from '@/domain/types';

export const defaultAutoApplySettings: AutoApplySettings = {
  enabled: false,
  minMatchScore: 80,
  dailyCap: 5,
  excludedCompanies: [],
  requireApproval: true,
};
