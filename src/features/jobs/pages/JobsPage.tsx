import { Button } from '@/shared/ui/Button';
import { EmptyState } from '@/shared/ui/EmptyState';
import { JobCard } from '@/features/jobs/components/JobCard';
import { JobCardSkeleton } from '@/features/jobs/components/JobCardSkeleton';
import { JobFilters } from '@/features/jobs/components/JobFilters';
import { filterJobs } from '@/features/jobs/filters/filterJobs';
import { useJobFilters } from '@/features/jobs/hooks/useJobFilters';
import { useMatchedJobs } from '@/features/jobs/hooks/useMatchedJobs';

export function JobsPage() {
  const { jobs, savedJobIds, isLoading, error, actionError, refetch, saveJob, hideJob } =
    useMatchedJobs();
  const filters = useJobFilters();
  const filterableJobs = jobs.map((matchedJob) => ({
    ...matchedJob,
    isSaved: savedJobIds.has(matchedJob.job.id),
  }));
  const filteredJobs = filterJobs(filterableJobs, filters.criteria);

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <p className="text-sm font-semibold text-emerald-800">Your matches</p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Jobs</h1>
      </header>

      <JobFilters
        criteria={filters.criteria}
        hasActiveFilters={filters.hasActiveFilters}
        onClear={filters.clearFilters}
        onFilterChange={filters.updateFilter}
        onSearchChange={filters.setSearchInput}
        searchInput={filters.searchInput}
      />

      {!isLoading && !error && (
        <p className="text-sm text-slate-600" aria-live="polite">
          {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
        </p>
      )}

      {actionError && (
        <p
          className="rounded border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
          role="alert"
        >
          {actionError}
        </p>
      )}

      {isLoading ? (
        <div aria-label="Loading matched jobs" className="grid gap-4 md:grid-cols-2" role="status">
          {Array.from({ length: 6 }, (_, index) => (
            <JobCardSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <EmptyState
          action={
            <Button onClick={refetch} type="button" variant="secondary">
              Retry
            </Button>
          }
          description={error}
          title="Jobs could not be loaded"
        />
      ) : filteredJobs.length === 0 ? (
        <EmptyState
          description={
            filters.hasActiveFilters
              ? 'Try adjusting or clearing your filters to see more jobs.'
              : 'There are no matching jobs to show right now. Check back soon.'
          }
          title={filters.hasActiveFilters ? 'No jobs match these filters' : 'No matched jobs'}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredJobs.map((matchedJob) => (
            <JobCard
              isSaved={savedJobIds.has(matchedJob.job.id)}
              key={matchedJob.job.id}
              matchedJob={matchedJob}
              onHide={hideJob}
              onSave={saveJob}
            />
          ))}
        </div>
      )}
    </section>
  );
}
