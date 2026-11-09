import type { MatchedJob } from '@/domain/types';
import { jobSourceConfig } from '@/features/jobs/config/jobSourceConfig';

export type FilterValue = string | boolean;
export type JobFilterCriteria = Record<string, FilterValue>;

export interface FilterableMatchedJob extends MatchedJob {
  isSaved: boolean;
}

export interface JobFilterDefinition {
  key: string;
  queryParam: string;
  label: string;
  type: 'search' | 'text' | 'select' | 'number' | 'toggle';
  defaultValue: FilterValue;
  placeholder?: string;
  min?: number;
  max?: number;
  options?: { label: string; value: string }[];
  matches: (job: FilterableMatchedJob, value: FilterValue) => boolean;
}

const sourceOptions = Object.entries(jobSourceConfig).map(([value, { label }]) => ({
  label,
  value,
}));

export const jobFilterDefinitions: JobFilterDefinition[] = [
  {
    key: 'search',
    queryParam: 'q',
    label: 'Search jobs',
    type: 'search',
    defaultValue: '',
    placeholder: 'Title, company, or skill',
    matches: (job, value) => {
      const query = typeof value === 'string' ? value.trim().toLocaleLowerCase() : '';
      const searchable = [job.job.title, job.job.company, ...job.job.skills]
        .join(' ')
        .toLocaleLowerCase();
      return !query || searchable.includes(query);
    },
  },
  {
    key: 'source',
    queryParam: 'source',
    label: 'Source',
    type: 'select',
    defaultValue: '',
    options: sourceOptions,
    matches: (job, value) => !value || job.job.source === value,
  },
  {
    key: 'location',
    queryParam: 'location',
    label: 'Location',
    type: 'text',
    defaultValue: '',
    placeholder: 'Any location',
    matches: (job, value) => {
      const location = typeof value === 'string' ? value.trim().toLocaleLowerCase() : '';
      return !location || job.job.location.toLocaleLowerCase().includes(location);
    },
  },
  {
    key: 'minExperience',
    queryParam: 'minExperience',
    label: 'Min experience (years)',
    type: 'number',
    defaultValue: '',
    min: 0,
    matches: (job, value) =>
      value === '' || (typeof value === 'string' && job.job.maxExperience >= Number(value)),
  },
  {
    key: 'maxExperience',
    queryParam: 'maxExperience',
    label: 'Max experience (years)',
    type: 'number',
    defaultValue: '',
    min: 0,
    matches: (job, value) =>
      value === '' || (typeof value === 'string' && job.job.minExperience <= Number(value)),
  },
  {
    key: 'minMatchScore',
    queryParam: 'minMatchScore',
    label: 'Minimum match score',
    type: 'number',
    defaultValue: '',
    min: 0,
    max: 100,
    matches: (job, value) =>
      value === '' || (typeof value === 'string' && job.score >= Number(value)),
  },
  {
    key: 'savedOnly',
    queryParam: 'savedOnly',
    label: 'Saved only',
    type: 'toggle',
    defaultValue: false,
    matches: (job, value) => !value || job.isSaved,
  },
];

export function parseJobFilterCriteria(params: URLSearchParams): JobFilterCriteria {
  return Object.fromEntries(
    jobFilterDefinitions.map((definition) => {
      const param = params.get(definition.queryParam);
      if (definition.type === 'toggle') {
        return [definition.key, param === 'true'];
      }
      if (definition.type === 'number') {
        const numericValue = Number(param);
        const isValidNumber =
          param !== null && param.trim() !== '' && Number.isFinite(numericValue);
        return [definition.key, isValidNumber ? param! : definition.defaultValue];
      }
      return [definition.key, param ?? definition.defaultValue];
    }),
  );
}

export function updateFilterParam(
  params: URLSearchParams,
  filterKey: string,
  value: FilterValue,
): URLSearchParams {
  const definition = jobFilterDefinitions.find((filter) => filter.key === filterKey);
  if (!definition) return params;

  const updatedParams = new URLSearchParams(params);
  if (value === definition.defaultValue) {
    updatedParams.delete(definition.queryParam);
  } else {
    updatedParams.set(definition.queryParam, String(value));
  }
  return updatedParams;
}

export function clearJobFilterParams(params: URLSearchParams): URLSearchParams {
  const updatedParams = new URLSearchParams(params);
  for (const definition of jobFilterDefinitions) {
    updatedParams.delete(definition.queryParam);
  }
  return updatedParams;
}

export function hasActiveJobFilters(criteria: JobFilterCriteria): boolean {
  return jobFilterDefinitions.some(
    (definition) => criteria[definition.key] !== definition.defaultValue,
  );
}

export function filterJobs(
  jobs: readonly FilterableMatchedJob[],
  criteria: JobFilterCriteria,
): FilterableMatchedJob[] {
  return jobs.filter((job) =>
    jobFilterDefinitions.every((definition) =>
      definition.matches(job, criteria[definition.key] ?? definition.defaultValue),
    ),
  );
}
