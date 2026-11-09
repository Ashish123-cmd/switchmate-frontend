import type { ApplicationStatus } from '@/domain/types';

export const applicationStatusColumns: {
  status: ApplicationStatus;
  title: string;
  emptyMessage: string;
}[] = [
  { status: 'saved', title: 'Saved', emptyMessage: 'No saved applications.' },
  { status: 'queued', title: 'Queued', emptyMessage: 'No queued applications.' },
  { status: 'applied', title: 'Applied', emptyMessage: 'No applied jobs yet.' },
  { status: 'interview', title: 'Interview', emptyMessage: 'No interviews yet.' },
  { status: 'rejected', title: 'Rejected', emptyMessage: 'No rejected applications.' },
];
