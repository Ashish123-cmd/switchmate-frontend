import { Link, useParams } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { EmptyState } from '@/shared/ui/EmptyState';
import { JobCardSkeleton } from '@/features/jobs/components/JobCardSkeleton';
import { MatchScoreBadge } from '@/features/jobs/components/MatchScoreBadge';
import { ApplySection } from '@/features/jobs/components/ApplySection';
import { jobSourceConfig } from '@/features/jobs/config/jobSourceConfig';
import { useJobDetail } from '@/features/jobs/hooks/useJobDetail';
import { classifyJobSkills } from '@/features/jobs/utils/classifyJobSkills';
import { JobNotFoundPage } from '@/features/jobs/pages/JobNotFoundPage';

const postedDateFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

export function JobDetailPage() {
  const { id } = useParams();
  const {
    matchedJob,
    profileSkills,
    isSaved,
    isLoading,
    isHiding,
    error,
    actionError,
    refetch,
    saveJob,
    hideJob,
  } = useJobDetail(id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <JobCardSkeleton />
        <JobCardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        action={
          <div className="flex gap-2">
            <Button onClick={refetch} type="button" variant="secondary">
              Retry
            </Button>
            <Link
              className="inline-flex min-h-10 items-center rounded px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              to="/jobs"
            >
              Back to jobs
            </Link>
          </div>
        }
        description={error}
        title="Job details unavailable"
      />
    );
  }

  if (!matchedJob) return <JobNotFoundPage />;

  const { job, score, reasons } = matchedJob;
  const source = jobSourceConfig[job.source];
  const { matched, missing } = classifyJobSkills(job.skills, profileSkills);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link className="text-sm font-medium text-emerald-800 hover:underline" to="/jobs">
        Back to jobs
      </Link>

      <Card className="space-y-6">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{job.title}</h1>
            <p className="text-lg font-medium text-slate-700">{job.company}</p>
            <p className="text-sm text-slate-600">{job.location}</p>
          </div>
          <MatchScoreBadge score={score} />
        </header>

        <div className="flex flex-wrap items-center gap-3 border-y border-slate-200 py-4 text-sm">
          <span className={`rounded px-2.5 py-1 text-xs font-medium ${source.className}`}>
            {source.label}
          </span>
          <time className="text-slate-600" dateTime={job.postedAt}>
            Posted {postedDateFormatter.format(new Date(job.postedAt))}
          </time>
        </div>

        <section className="space-y-3" aria-labelledby="job-description-heading">
          <h2 className="text-lg font-semibold text-slate-900" id="job-description-heading">
            Description
          </h2>
          <p className="whitespace-pre-line text-sm leading-6 text-slate-700">{job.description}</p>
        </section>

        <section className="space-y-3" aria-labelledby="job-skills-heading">
          <h2 className="text-lg font-semibold text-slate-900" id="job-skills-heading">
            Required skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {matched.map((skill) => (
              <span
                className="rounded border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm text-emerald-900"
                key={`matched-${skill}`}
              >
                {skill} <span className="text-xs">Matched</span>
              </span>
            ))}
            {missing.map((skill) => (
              <span
                className="rounded border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm text-amber-950"
                key={`missing-${skill}`}
              >
                {skill} <span className="text-xs">Missing</span>
              </span>
            ))}
          </div>
        </section>

        <section className="space-y-3" aria-labelledby="job-match-reasons-heading">
          <h2 className="text-lg font-semibold text-slate-900" id="job-match-reasons-heading">
            Why this matches
          </h2>
          <ul className="list-inside list-disc space-y-2 text-sm text-slate-700">
            {reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </section>

        {actionError && (
          <p className="text-sm text-red-700" role="alert">
            {actionError}
          </p>
        )}

        <div className="flex flex-wrap gap-2 border-t border-slate-200 pt-5">
          <Button aria-pressed={isSaved} onClick={saveJob} type="button" variant="secondary">
            <span aria-hidden="true" className="mr-2 text-base">
              {isSaved ? '★' : '☆'}
            </span>
            {isSaved ? 'Saved' : 'Save'}
          </Button>
          <Button disabled={isHiding} onClick={hideJob} type="button" variant="ghost">
            {isHiding ? 'Hiding...' : 'Hide'}
          </Button>
        </div>
      </Card>

      <ApplySection job={job} />
    </div>
  );
}
