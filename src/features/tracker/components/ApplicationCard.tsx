import { Link } from 'react-router-dom';
import type { ApplicationStatus } from '@/domain/types';
import { Card } from '@/shared/ui/Card';
import type { TrackedApplication } from '@/features/tracker/hooks/useApplicationTracker';
import { applicationStatusColumns } from '@/features/tracker/config/applicationStatusColumns';

interface ApplicationCardProps {
  item: TrackedApplication;
  isPending: boolean;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
}

const updatedDateFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

export function ApplicationCard({ item, isPending, onStatusChange }: ApplicationCardProps) {
  const { application, job } = item;

  return (
    <Card className="space-y-4 p-4">
      <div className="space-y-1">
        {job ? (
          <Link
            className="font-semibold text-slate-900 hover:text-emerald-800 hover:underline"
            to={`/jobs/${job.id}`}
          >
            {job.title}
          </Link>
        ) : (
          <p className="font-semibold text-slate-900">Job no longer available</p>
        )}
        <p className="text-sm text-slate-600">{job?.company ?? `Job ID: ${application.jobId}`}</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span
          className={`rounded px-2 py-1 text-xs font-medium ${
            application.mode === 'auto' ? 'bg-sky-50 text-sky-800' : 'bg-slate-100 text-slate-700'
          }`}
        >
          {application.mode === 'auto' ? 'Auto' : 'Manual'}
        </span>
        <time className="text-xs text-slate-500" dateTime={application.updatedAt}>
          Updated {updatedDateFormatter.format(new Date(application.updatedAt))}
        </time>
      </div>

      <label className="block space-y-1 text-xs font-medium text-slate-600">
        <span>Move to</span>
        <select
          className="min-h-9 w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-800 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
          disabled={isPending}
          onChange={(event) =>
            onStatusChange(application.id, event.target.value as ApplicationStatus)
          }
          value={application.status}
        >
          {applicationStatusColumns.map((column) => (
            <option key={column.status} value={column.status}>
              {column.title}
            </option>
          ))}
        </select>
      </label>
    </Card>
  );
}
