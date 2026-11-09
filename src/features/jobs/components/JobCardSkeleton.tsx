import { Card } from '@/shared/ui/Card';

export function JobCardSkeleton() {
  return (
    <Card aria-hidden="true" className="space-y-4">
      <div className="flex justify-between gap-4">
        <div className="w-2/3 space-y-3">
          <div className="h-5 w-4/5 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-2/5 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
        </div>
        <div className="h-7 w-24 animate-pulse rounded bg-slate-200" />
      </div>
      <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
      <div className="space-y-2">
        <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-slate-200" />
      </div>
    </Card>
  );
}
