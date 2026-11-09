import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import {
  jobFilterDefinitions,
  type FilterValue,
  type JobFilterCriteria,
} from '@/features/jobs/filters/filterJobs';

interface JobFiltersProps {
  criteria: JobFilterCriteria;
  searchInput: string;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onFilterChange: (key: string, value: FilterValue) => void;
  onClear: () => void;
}

export function JobFilters({
  criteria,
  searchInput,
  hasActiveFilters,
  onSearchChange,
  onFilterChange,
  onClear,
}: JobFiltersProps) {
  return (
    <section
      aria-label="Filter jobs"
      className="space-y-4 rounded border border-slate-200 bg-white p-4"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {jobFilterDefinitions.map((definition) => {
          const value = criteria[definition.key] ?? definition.defaultValue;
          const id = `job-filter-${definition.key}`;

          if (definition.type === 'toggle') {
            return (
              <label
                className="flex min-h-10 items-center gap-3 self-end text-sm font-medium text-slate-700"
                htmlFor={id}
                key={definition.key}
              >
                <input
                  checked={value === true}
                  className="size-4 accent-emerald-800"
                  id={id}
                  onChange={(event) => onFilterChange(definition.key, event.target.checked)}
                  type="checkbox"
                />
                {definition.label}
              </label>
            );
          }

          if (definition.type === 'select') {
            return (
              <label
                className="block space-y-1.5 text-sm font-medium text-slate-700"
                htmlFor={id}
                key={definition.key}
              >
                <span>{definition.label}</span>
                <select
                  className="min-h-10 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
                  id={id}
                  onChange={(event) => onFilterChange(definition.key, event.target.value)}
                  value={String(value)}
                >
                  <option value="">All sources</option>
                  {definition.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            );
          }

          const searchValue = definition.key === 'search' ? searchInput : String(value);
          const inputType =
            definition.type === 'search'
              ? 'search'
              : definition.type === 'number'
                ? 'number'
                : 'text';
          const onChange = (nextValue: string) =>
            definition.key === 'search'
              ? onSearchChange(nextValue)
              : onFilterChange(definition.key, nextValue);

          return (
            <label
              className="block space-y-1.5 text-sm font-medium text-slate-700"
              htmlFor={id}
              key={definition.key}
            >
              <span>{definition.label}</span>
              <Input
                id={id}
                max={definition.max}
                min={definition.min}
                onChange={(event) => onChange(event.target.value)}
                placeholder={definition.placeholder}
                type={inputType}
                value={searchValue}
              />
            </label>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
        <p className="text-sm text-slate-600" aria-live="polite">
          Results update as filters change.
        </p>
        <Button disabled={!hasActiveFilters} onClick={onClear} type="button" variant="secondary">
          Clear filters
        </Button>
      </div>
    </section>
  );
}
