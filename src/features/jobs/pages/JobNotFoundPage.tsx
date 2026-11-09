import { Link } from 'react-router-dom';
import { EmptyState } from '@/shared/ui/EmptyState';

export function JobNotFoundPage() {
  return (
    <EmptyState
      action={
        <Link
          className="inline-flex min-h-10 items-center rounded bg-emerald-800 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-900"
          to="/jobs"
        >
          Back to jobs
        </Link>
      }
      description="This job may have been removed or the link may be incorrect."
      title="We couldn’t find that job"
    />
  );
}
