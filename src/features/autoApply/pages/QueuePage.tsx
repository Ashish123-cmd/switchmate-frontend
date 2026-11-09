import { Link } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Spinner } from '@/shared/ui/Spinner';
import { useAutoApplyQueue } from '@/features/autoApply/hooks/useAutoApplyQueue';

export function QueuePage() {
  const { items, isLoading, error, pendingIds, refetch, approve, reject } = useAutoApplyQueue();

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <p className="text-sm font-semibold text-emerald-800">Auto-apply</p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Approval queue</h1>
      </header>

      <p className="rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        Auto-apply is simulated in this version. Review each queued job before approving it.
      </p>

      {isLoading ? (
        <div className="flex min-h-48 items-center justify-center">
          <Spinner label="Loading approval queue" />
        </div>
      ) : error ? (
        <EmptyState
          action={
            <Button onClick={refetch} type="button" variant="secondary">
              Retry
            </Button>
          }
          description={error}
          title="Queue unavailable"
        />
      ) : items.length === 0 ? (
        <EmptyState
          description="Auto-apply jobs that require your approval will appear here."
          title="Your queue is clear"
        />
      ) : (
        <ul className="space-y-3">
          {items.map(({ application, job }) => {
            const isPending = pendingIds.has(application.id);
            return (
              <li key={application.id}>
                <Card className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h2 className="font-semibold text-slate-900">
                      {job?.title ?? 'Job no longer available'}
                    </h2>
                    <p className="text-sm text-slate-600">
                      {job ? `${job.company} · ${job.location}` : `Job ID: ${application.jobId}`}
                    </p>
                    <p className="text-xs text-slate-500">Queued for approval</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {job ? (
                      <Link
                        className="inline-flex min-h-10 items-center rounded border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
                        to={`/jobs/${job.id}`}
                      >
                        Open job
                      </Link>
                    ) : (
                      <Button disabled type="button" variant="secondary">
                        Open job
                      </Button>
                    )}
                    <Button
                      disabled={isPending}
                      onClick={() => void approve(application.id)}
                      type="button"
                    >
                      {isPending ? 'Updating...' : 'Approve'}
                    </Button>
                    <Button
                      disabled={isPending}
                      onClick={() => void reject(application.id)}
                      type="button"
                      variant="secondary"
                    >
                      Reject
                    </Button>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
