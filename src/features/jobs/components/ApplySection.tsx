import type { Job } from '@/domain/types';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Spinner } from '@/shared/ui/Spinner';
import { jobSourceConfig } from '@/features/jobs/config/jobSourceConfig';
import { CopyReadyAnswers } from '@/features/jobs/components/CopyReadyAnswers';
import { useApplyWorkflow } from '@/features/jobs/hooks/useApplyWorkflow';

interface ApplySectionProps {
  job: Job;
}

const statusLabels = {
  saved: 'Saved',
  queued: 'Queued',
  applied: 'Applied',
  interview: 'Interview',
  rejected: 'Rejected',
} as const;

export function ApplySection({ job }: ApplySectionProps) {
  const {
    application,
    copyReadyAnswers,
    isLoading,
    isStarting,
    isUpdating,
    showConfirmation,
    copiedId,
    error,
    actionError,
    refetch,
    startApplication,
    confirmApplied,
    confirmNotApplied,
    copyAnswer,
  } = useApplyWorkflow({ job });
  const source = jobSourceConfig[job.source];

  return (
    <div className="space-y-5">
      <Card className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Apply</h2>
          <p className="mt-1 text-sm text-slate-600">
            Open the employer’s application and track your progress here.
          </p>
        </div>

        {isLoading ? (
          <Spinner label="Loading application status" />
        ) : error ? (
          <div className="space-y-3">
            <p className="text-sm text-red-700" role="alert">
              {error}
            </p>
            <Button onClick={refetch} type="button" variant="secondary">
              Retry
            </Button>
          </div>
        ) : application ? (
          <div aria-live="polite" className="space-y-3">
            <p className="text-sm text-slate-700">
              Application status:{' '}
              <span className="font-semibold">{statusLabels[application.status]}</span>
            </p>
            {showConfirmation && (
              <div className="space-y-3 rounded border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-800">Did you apply?</p>
                <div className="flex gap-2">
                  <Button disabled={isUpdating} onClick={confirmApplied} type="button">
                    Yes
                  </Button>
                  <Button
                    disabled={isUpdating}
                    onClick={confirmNotApplied}
                    type="button"
                    variant="secondary"
                  >
                    Not yet
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Button disabled={isStarting} onClick={startApplication} type="button">
            {isStarting ? 'Opening application...' : `Apply on ${source.label}`}
          </Button>
        )}
        {actionError && (
          <p className="text-sm text-red-700" role="alert">
            {actionError}
          </p>
        )}
      </Card>

      {!isLoading && !error && (
        <CopyReadyAnswers answers={copyReadyAnswers} copiedId={copiedId} onCopy={copyAnswer} />
      )}
    </div>
  );
}
