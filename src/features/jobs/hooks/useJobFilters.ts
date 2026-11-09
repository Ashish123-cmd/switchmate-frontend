import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  clearJobFilterParams,
  hasActiveJobFilters,
  parseJobFilterCriteria,
  updateFilterParam,
  type FilterValue,
} from '@/features/jobs/filters/filterJobs';

export function useJobFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const criteria = parseJobFilterCriteria(searchParams);
  const [searchInput, setSearchInput] = useState(String(criteria.search ?? ''));

  useEffect(() => {
    setSearchInput(String(criteria.search ?? ''));
  }, [criteria.search]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearchParams((current) => updateFilterParam(current, 'search', searchInput), {
        replace: true,
      });
    }, 300);
    return () => window.clearTimeout(timeoutId);
  }, [searchInput, setSearchParams]);

  function updateFilter(key: string, value: FilterValue) {
    if (key === 'search') {
      setSearchInput(String(value));
      return;
    }
    setSearchParams((current) => updateFilterParam(current, key, value), { replace: true });
  }

  function clearFilters() {
    setSearchInput('');
    setSearchParams(clearJobFilterParams, { replace: true });
  }

  return {
    criteria,
    searchInput,
    setSearchInput,
    updateFilter,
    clearFilters,
    hasActiveFilters: hasActiveJobFilters(criteria) || searchInput.trim().length > 0,
  };
}
