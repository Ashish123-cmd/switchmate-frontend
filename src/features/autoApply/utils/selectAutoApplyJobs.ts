import type { Application, AutoApplySettings, MatchedJob } from '@/domain/types';

export interface AutoApplySelectionInput {
  jobs: readonly MatchedJob[];
  settings: AutoApplySettings;
  applications: readonly Application[];
  hiddenJobIds: readonly string[];
  now: Date;
}

function dateKey(value: string | Date): string {
  return new Date(value).toISOString().slice(0, 10);
}

export function selectAutoApplyJobs({
  jobs,
  settings,
  applications,
  hiddenJobIds,
  now,
}: AutoApplySelectionInput): MatchedJob[] {
  if (!settings.enabled || settings.dailyCap <= 0) return [];

  const hiddenIds = new Set(hiddenJobIds);
  const excludedCompanies = new Set(
    settings.excludedCompanies.map((company) => company.trim().toLocaleLowerCase()),
  );
  const existingJobIds = new Set(
    applications
      .filter((application) => ['queued', 'applied', 'interview'].includes(application.status))
      .map((application) => application.jobId),
  );
  const autoApplicationsToday = applications.filter(
    (application) =>
      application.mode === 'auto' &&
      dateKey(application.updatedAt) === dateKey(now) &&
      application.status !== 'rejected',
  ).length;
  const remainingCapacity = Math.max(0, Math.floor(settings.dailyCap) - autoApplicationsToday);
  if (remainingCapacity === 0) return [];

  return [...jobs]
    .filter(
      ({ job, score }) =>
        score >= settings.minMatchScore &&
        !hiddenIds.has(job.id) &&
        !existingJobIds.has(job.id) &&
        !excludedCompanies.has(job.company.trim().toLocaleLowerCase()),
    )
    .sort((first, second) => second.score - first.score)
    .slice(0, remainingCapacity);
}
