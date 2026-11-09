import { useState } from 'react';
import type { Application } from '@/domain/types';
import { Button } from '@/shared/ui/Button';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Spinner } from '@/shared/ui/Spinner';
import { ApplicationCard } from '@/features/tracker/components/ApplicationCard';
import { applicationStatusColumns } from '@/features/tracker/config/applicationStatusColumns';
import { useApplicationTracker } from '@/features/tracker/hooks/useApplicationTracker';

type ModeFilter = 'all' | Application['mode'];

export function TrackerPage() {
  const [modeFilter, setModeFilter] = useState<ModeFilter>('all');
  const { items, isLoading, error, pendingIds, refetch, changeStatus } = useApplicationTracker();
  const filteredItems = items.filter(
    ({ application }) => modeFilter === 'all' || application.mode === modeFilter,
  );

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-emerald-800">Your applications</p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Tracker</h1>
        </div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          Mode
          <select
            className="min-h-10 rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
            onChange={(event) => setModeFilter(event.target.value as ModeFilter)}
            value={modeFilter}
          >
            <option value="all">All modes</option>
            <option value="manual">Manual</option>
            <option value="auto">Auto</option>
          </select>
        </label>
      </header>

      {isLoading ? (
        <div className="flex min-h-56 items-center justify-center">
          <Spinner label="Loading application tracker" />
        </div>
      ) : error ? (
        <EmptyState
          action={
            <Button onClick={refetch} type="button" variant="secondary">
              Retry
            </Button>
          }
          description={error}
          title="Tracker unavailable"
        />
      ) : (
        <div className="grid items-start gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {applicationStatusColumns.map((column) => {
            const columnItems = filteredItems.filter(
              ({ application }) => application.status === column.status,
            );
            return (
              <section
                aria-labelledby={`tracker-column-${column.status}`}
                className="min-w-0 space-y-3"
                key={column.status}
              >
                <header className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h2
                    className="text-sm font-semibold text-slate-800"
                    id={`tracker-column-${column.status}`}
                  >
                    {column.title}
                  </h2>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                    {columnItems.length}
                  </span>
                </header>
                {columnItems.length === 0 ? (
                  <p className="rounded border border-dashed border-slate-300 px-3 py-6 text-center text-xs text-slate-500">
                    {column.emptyMessage}
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {columnItems.map((item) => (
                      <li key={item.application.id}>
                        <ApplicationCard
                          isPending={pendingIds.has(item.application.id)}
                          item={item}
                          onStatusChange={changeStatus}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      )}
    </section>
  );
}
