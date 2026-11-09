import { describe, expect, it } from 'vitest';
import type { Job, MatchedJob } from '@/domain/types';
import { filterJobs, parseJobFilterCriteria } from '@/features/jobs/filters/filterJobs';

function matchedJob(
  id: string,
  overrides: Partial<Job> = {},
  score = 80,
  isSaved = false,
): MatchedJob & { isSaved: boolean } {
  const job: Job = {
    id,
    title: 'Frontend Engineer',
    company: 'Northstar',
    location: 'Remote, US',
    source: 'greenhouse',
    applyUrl: 'https://jobs.example.com',
    description: 'Build product interfaces.',
    skills: ['React', 'TypeScript'],
    minExperience: 3,
    maxExperience: 6,
    postedAt: '2026-11-01T00:00:00.000Z',
    ...overrides,
  };
  return { job, score, reasons: [], isSaved };
}

describe('filterJobs', () => {
  const jobs = [
    matchedJob('one', {}, 88, true),
    matchedJob(
      'two',
      {
        title: 'Backend Engineer',
        company: 'Fieldnote',
        source: 'lever',
        location: 'Austin, TX',
        skills: ['Node.js'],
      },
      62,
    ),
  ];

  it('searches title, company, and skills case-insensitively', () => {
    expect(filterJobs(jobs, { search: 'typescript' }).map((item) => item.job.id)).toEqual(['one']);
    expect(filterJobs(jobs, { search: 'fieldnote' }).map((item) => item.job.id)).toEqual(['two']);
  });

  it('applies source, location, and experience filters together', () => {
    const filtered = filterJobs(jobs, {
      search: '',
      source: 'lever',
      location: 'austin',
      minExperience: '4',
      maxExperience: '5',
    });
    expect(filtered.map((item) => item.job.id)).toEqual(['two']);
  });

  it('filters by minimum score and saved-only state', () => {
    expect(filterJobs(jobs, { minMatchScore: '70' }).map((item) => item.job.id)).toEqual(['one']);
    expect(filterJobs(jobs, { savedOnly: true }).map((item) => item.job.id)).toEqual(['one']);
  });

  it('reads filter values from URL search parameters', () => {
    const criteria = parseJobFilterCriteria(
      new URLSearchParams('q=react&source=ashby&savedOnly=true&minExperience=2'),
    );
    expect(criteria).toMatchObject({
      search: 'react',
      source: 'ashby',
      savedOnly: true,
      minExperience: '2',
    });
  });
});
