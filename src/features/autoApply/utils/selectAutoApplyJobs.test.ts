import { describe, expect, it } from 'vitest';
import type { Application, AutoApplySettings, MatchedJob } from '@/domain/types';
import { selectAutoApplyJobs } from '@/features/autoApply/utils/selectAutoApplyJobs';

const settings: AutoApplySettings = {
  enabled: true,
  minMatchScore: 70,
  dailyCap: 3,
  excludedCompanies: ['Excluded Co'],
  requireApproval: true,
};

function job(id: string, score: number, company = 'Company'): MatchedJob {
  return {
    job: {
      id,
      title: 'Engineer',
      company,
      location: 'Remote',
      source: 'greenhouse',
      applyUrl: 'https://jobs.example.com',
      description: 'Build software.',
      skills: ['TypeScript'],
      minExperience: 2,
      maxExperience: 5,
      postedAt: '2026-11-08T00:00:00.000Z',
    },
    score,
    reasons: [],
  };
}

function application(
  jobId: string,
  status: Application['status'],
  mode: Application['mode'] = 'auto',
  updatedAt = '2026-11-08T10:00:00.000Z',
): Application {
  return { id: `application-${jobId}`, jobId, status, mode, updatedAt };
}

describe('selectAutoApplyJobs', () => {
  const now = new Date('2026-11-08T12:00:00.000Z');

  it('filters by score, hidden jobs, excluded companies, and existing applications', () => {
    const selected = selectAutoApplyJobs({
      jobs: [
        job('eligible', 90),
        job('low-score', 60),
        job('hidden', 95),
        job('excluded', 99, 'Excluded Co'),
        job('queued', 92),
        job('applied', 91),
      ],
      settings,
      applications: [application('queued', 'queued'), application('applied', 'applied')],
      hiddenJobIds: ['hidden'],
      now,
    });
    expect(selected.map(({ job: matchedJob }) => matchedJob.id)).toEqual(['eligible']);
  });

  it('sorts by score and applies remaining daily capacity', () => {
    const selected = selectAutoApplyJobs({
      jobs: [job('lower', 75), job('higher', 95), job('middle', 85)],
      settings: { ...settings, dailyCap: 3 },
      applications: [application('already-run', 'queued')],
      hiddenJobIds: [],
      now,
    });
    expect(selected.map(({ job: matchedJob }) => matchedJob.id)).toEqual(['higher', 'middle']);
  });

  it('returns no jobs when disabled or daily capacity is exhausted', () => {
    const input = {
      jobs: [job('available', 99)],
      settings,
      applications: [
        application('one', 'queued'),
        application('two', 'applied'),
        application('three', 'queued'),
      ],
      hiddenJobIds: [],
      now,
    };
    expect(selectAutoApplyJobs({ ...input, settings: { ...settings, enabled: false } })).toEqual(
      [],
    );
    expect(selectAutoApplyJobs(input)).toEqual([]);
  });
});
