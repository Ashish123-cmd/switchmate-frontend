import { Link } from 'react-router-dom';
import type { MatchedJob } from '@/domain/types';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { jobSourceConfig } from '@/features/jobs/config/jobSourceConfig';
import { MatchScoreBadge } from '@/features/jobs/components/MatchScoreBadge';

interface JobCardProps {
  matchedJob: MatchedJob;
  isSaved: boolean;
  onSave: (jobId: string) => void;
  onHide: (jobId: string) => void;
}

const postedDateFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

export function JobCard({ matchedJob, isSaved, onSave, onHide }: JobCardProps) {
  const { job, score, reasons } = matchedJob;
  const source = jobSourceConfig[job.source];

  return (
    <Card className="space-y-4 transition-shadow hover:shadow-md">
      <Link
        aria-label={`View ${job.title} at ${job.company}`}
        className="block space-y-4 rounded"
        to={`/jobs/${job.id}`}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-slate-900">{job.title}</h2>
            <p className="font-medium text-slate-700">{job.company}</p>
            <p className="text-sm text-slate-600">{job.location}</p>
          </div>
          <MatchScoreBadge score={score} />
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className={`rounded px-2.5 py-1 font-medium ${source.className}`}>
            {source.label}
          </span>
          <time className="text-slate-500" dateTime={job.postedAt}>
            Posted {postedDateFormatter.format(new Date(job.postedAt))}
          </time>
        </div>
        <ul className="space-y-1.5 text-sm text-slate-600">
          {reasons.slice(0, 2).map((reason) => (
            <li className="flex gap-2" key={reason}>
              <span aria-hidden="true" className="text-emerald-700">
                •
              </span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </Link>
      <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
        <Button
          aria-label={
            isSaved ? `Saved ${job.title} at ${job.company}` : `Save ${job.title} at ${job.company}`
          }
          aria-pressed={isSaved}
          onClick={() => onSave(job.id)}
          type="button"
          variant="secondary"
        >
          <span aria-hidden="true" className="mr-2 text-base">
            {isSaved ? '★' : '☆'}
          </span>
          {isSaved ? 'Saved' : 'Save'}
        </Button>
        <Button onClick={() => onHide(job.id)} type="button" variant="ghost">
          Hide
        </Button>
      </div>
    </Card>
  );
}
