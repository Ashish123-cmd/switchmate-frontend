import type { JobSource } from '@/domain/types';

export const jobSourceConfig: Record<JobSource, { label: string; className: string }> = {
  greenhouse: { label: 'Greenhouse', className: 'bg-emerald-50 text-emerald-800' },
  lever: { label: 'Lever', className: 'bg-sky-50 text-sky-800' },
  ashby: { label: 'Ashby', className: 'bg-amber-50 text-amber-900' },
  workday: { label: 'Workday', className: 'bg-rose-50 text-rose-800' },
};
