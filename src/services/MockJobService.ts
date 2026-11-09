import type { JobService } from '@/domain/JobService';
import type { Job, JobFilters, MatchedJob, UserProfile } from '@/domain/types';
import { delay, readStorage, storageKeys, writeStorage } from '@/services/storage';

interface JobStore {
  jobs: Job[];
  savedJobIds: string[];
  hiddenJobIds: string[];
}

type JobSeed = Pick<
  Job,
  'id' | 'title' | 'company' | 'location' | 'source' | 'skills' | 'minExperience' | 'maxExperience'
>;

const seeds: JobSeed[] = [
  {
    id: 'job-001',
    title: 'Senior Frontend Engineer',
    company: 'Northstar',
    location: 'San Francisco, CA',
    source: 'greenhouse',
    skills: ['React', 'TypeScript', 'GraphQL'],
    minExperience: 5,
    maxExperience: 8,
  },
  {
    id: 'job-002',
    title: 'Full Stack Engineer',
    company: 'Fieldnote',
    location: 'Remote, US',
    source: 'lever',
    skills: ['TypeScript', 'Node.js', 'PostgreSQL'],
    minExperience: 3,
    maxExperience: 6,
  },
  {
    id: 'job-003',
    title: 'Software Engineer, Platform',
    company: 'Copperline',
    location: 'Seattle, WA',
    source: 'ashby',
    skills: ['Go', 'Kubernetes', 'AWS'],
    minExperience: 4,
    maxExperience: 7,
  },
  {
    id: 'job-004',
    title: 'Backend Engineer',
    company: 'Lattice Harbor',
    location: 'Remote, US',
    source: 'workday',
    skills: ['Node.js', 'PostgreSQL', 'AWS'],
    minExperience: 3,
    maxExperience: 6,
  },
  {
    id: 'job-005',
    title: 'Staff Product Engineer',
    company: 'Juniper Health',
    location: 'New York, NY',
    source: 'greenhouse',
    skills: ['React', 'TypeScript', 'Ruby'],
    minExperience: 7,
    maxExperience: 10,
  },
  {
    id: 'job-006',
    title: 'Frontend Engineer',
    company: 'Morrow',
    location: 'Austin, TX',
    source: 'lever',
    skills: ['React', 'JavaScript', 'CSS'],
    minExperience: 2,
    maxExperience: 5,
  },
  {
    id: 'job-007',
    title: 'Senior Full Stack Engineer',
    company: 'Beacon AI',
    location: 'Remote, US',
    source: 'ashby',
    skills: ['TypeScript', 'React', 'Python'],
    minExperience: 5,
    maxExperience: 8,
  },
  {
    id: 'job-008',
    title: 'Cloud Infrastructure Engineer',
    company: 'Orbit Works',
    location: 'San Francisco, CA',
    source: 'workday',
    skills: ['AWS', 'Terraform', 'Kubernetes'],
    minExperience: 4,
    maxExperience: 7,
  },
  {
    id: 'job-009',
    title: 'Software Engineer, Developer Experience',
    company: 'Parcel Labs',
    location: 'Remote, US',
    source: 'greenhouse',
    skills: ['TypeScript', 'Node.js', 'Docker'],
    minExperience: 3,
    maxExperience: 6,
  },
  {
    id: 'job-010',
    title: 'Senior Backend Engineer',
    company: 'Cedar Finance',
    location: 'Chicago, IL',
    source: 'lever',
    skills: ['Java', 'PostgreSQL', 'AWS'],
    minExperience: 5,
    maxExperience: 9,
  },
  {
    id: 'job-011',
    title: 'React Native Engineer',
    company: 'Daybreak',
    location: 'Remote, US',
    source: 'ashby',
    skills: ['React Native', 'TypeScript', 'iOS'],
    minExperience: 3,
    maxExperience: 6,
  },
  {
    id: 'job-012',
    title: 'Data Platform Engineer',
    company: 'Trueframe',
    location: 'Boston, MA',
    source: 'workday',
    skills: ['Python', 'Spark', 'Airflow'],
    minExperience: 4,
    maxExperience: 7,
  },
  {
    id: 'job-013',
    title: 'Product Engineer',
    company: 'Common Thread',
    location: 'Remote, US',
    source: 'greenhouse',
    skills: ['React', 'Node.js', 'PostgreSQL'],
    minExperience: 3,
    maxExperience: 6,
  },
  {
    id: 'job-014',
    title: 'Senior Software Engineer, API',
    company: 'Monarch Cloud',
    location: 'Denver, CO',
    source: 'lever',
    skills: ['Go', 'GraphQL', 'AWS'],
    minExperience: 5,
    maxExperience: 8,
  },
  {
    id: 'job-015',
    title: 'Engineering Lead, Web',
    company: 'Openwater',
    location: 'San Francisco, CA',
    source: 'ashby',
    skills: ['React', 'TypeScript', 'Leadership'],
    minExperience: 8,
    maxExperience: 12,
  },
  {
    id: 'job-016',
    title: 'Software Engineer II',
    company: 'Maple Street',
    location: 'Remote, US',
    source: 'workday',
    skills: ['TypeScript', 'React', 'SQL'],
    minExperience: 2,
    maxExperience: 5,
  },
  {
    id: 'job-017',
    title: 'Senior DevOps Engineer',
    company: 'Redwood Grid',
    location: 'Portland, OR',
    source: 'greenhouse',
    skills: ['AWS', 'Terraform', 'Linux'],
    minExperience: 5,
    maxExperience: 8,
  },
  {
    id: 'job-018',
    title: 'Backend Software Engineer',
    company: 'Kitepath',
    location: 'Remote, US',
    source: 'lever',
    skills: ['Python', 'Django', 'PostgreSQL'],
    minExperience: 2,
    maxExperience: 5,
  },
  {
    id: 'job-019',
    title: 'Senior UI Engineer',
    company: 'Signal House',
    location: 'New York, NY',
    source: 'ashby',
    skills: ['TypeScript', 'React', 'Accessibility'],
    minExperience: 5,
    maxExperience: 8,
  },
  {
    id: 'job-020',
    title: 'Machine Learning Platform Engineer',
    company: 'Evergreen Data',
    location: 'Remote, US',
    source: 'workday',
    skills: ['Python', 'Kubernetes', 'AWS'],
    minExperience: 4,
    maxExperience: 7,
  },
  {
    id: 'job-021',
    title: 'Full Stack Developer',
    company: 'Silver Birch',
    location: 'Atlanta, GA',
    source: 'greenhouse',
    skills: ['React', 'Node.js', 'MongoDB'],
    minExperience: 2,
    maxExperience: 5,
  },
  {
    id: 'job-022',
    title: 'Staff Backend Engineer',
    company: 'Atlas Grove',
    location: 'Seattle, WA',
    source: 'lever',
    skills: ['Go', 'PostgreSQL', 'Distributed Systems'],
    minExperience: 8,
    maxExperience: 12,
  },
  {
    id: 'job-023',
    title: 'Software Engineer, Integrations',
    company: 'Tandem Works',
    location: 'Remote, US',
    source: 'ashby',
    skills: ['TypeScript', 'Node.js', 'REST APIs'],
    minExperience: 3,
    maxExperience: 6,
  },
  {
    id: 'job-024',
    title: 'Frontend Platform Engineer',
    company: 'Bluejay Commerce',
    location: 'Los Angeles, CA',
    source: 'workday',
    skills: ['React', 'TypeScript', 'Vite'],
    minExperience: 4,
    maxExperience: 7,
  },
  {
    id: 'job-025',
    title: 'Software Engineer, Cloud',
    company: 'Granite Peak',
    location: 'Remote, US',
    source: 'greenhouse',
    skills: ['Java', 'AWS', 'Docker'],
    minExperience: 3,
    maxExperience: 6,
  },
];

const seededJobs: Job[] = seeds.map((seed, index) => ({
  ...seed,
  applyUrl: `https://jobs.example.com/${seed.id}`,
  description: `${seed.title} at ${seed.company}, building dependable products with ${seed.skills.slice(0, 3).join(', ')}.`,
  postedAt: new Date(Date.now() - index * 86_400_000).toISOString(),
}));

function initialStore(): JobStore {
  return { jobs: seededJobs, savedJobIds: [], hiddenJobIds: [] };
}

function getStore(): JobStore {
  return readStorage(storageKeys.jobs, initialStore());
}

function scoreJob(job: Job, profile: UserProfile): MatchedJob {
  const profileSkills = new Set(profile.skills.map((skill) => skill.toLocaleLowerCase()));
  const overlap = job.skills.filter((skill) => profileSkills.has(skill.toLocaleLowerCase()));
  const skillScore = (overlap.length / job.skills.length) * 70;
  const years = profile.totalExperienceYears;
  const experienceScore =
    years < job.minExperience
      ? Math.max(0, 30 - (job.minExperience - years) * 10)
      : years > job.maxExperience
        ? Math.max(0, 30 - (years - job.maxExperience) * 5)
        : 30;
  const reasons = [
    overlap.length > 0
      ? `Matches ${overlap.length} of ${job.skills.length} listed skills: ${overlap.join(', ')}.`
      : `No direct match for the listed skills: ${job.skills.join(', ')}.`,
    years >= job.minExperience && years <= job.maxExperience
      ? `${years} years of experience is within the ${job.minExperience}-${job.maxExperience} year range.`
      : `The role asks for ${job.minExperience}-${job.maxExperience} years; your profile lists ${years}.`,
  ];

  return { job, score: Math.round(skillScore + experienceScore), reasons };
}

function matchesFilters(job: Job, filters: JobFilters): boolean {
  const query = filters.query?.trim().toLocaleLowerCase();
  const searchableText = `${job.title} ${job.company} ${job.location}`.toLocaleLowerCase();
  const locations = filters.locations?.map((location) => location.toLocaleLowerCase());
  const skills = filters.skills?.map((skill) => skill.toLocaleLowerCase());

  return (
    (!query || searchableText.includes(query)) &&
    (!locations?.length ||
      locations.some((location) => job.location.toLocaleLowerCase().includes(location))) &&
    (!filters.sources?.length || filters.sources.includes(job.source)) &&
    (!skills?.length ||
      skills.some((skill) =>
        job.skills.some((jobSkill) => jobSkill.toLocaleLowerCase() === skill),
      )) &&
    (filters.minExperience === undefined || job.maxExperience >= filters.minExperience) &&
    (filters.maxExperience === undefined || job.minExperience <= filters.maxExperience)
  );
}

export class MockJobService implements JobService {
  async listMatchedJobs(profile: UserProfile, filters: JobFilters = {}): Promise<MatchedJob[]> {
    await delay();
    const store = getStore();
    return store.jobs
      .filter((job) => !store.hiddenJobIds.includes(job.id) && matchesFilters(job, filters))
      .map((job) => scoreJob(job, profile))
      .filter((matchedJob) => matchedJob.score >= (filters.minMatchScore ?? 0))
      .sort((left, right) => right.score - left.score);
  }

  async getJobById(id: string): Promise<Job | null> {
    await delay();
    return getStore().jobs.find((job) => job.id === id) ?? null;
  }

  async getMatchedJobById(id: string, profile: UserProfile): Promise<MatchedJob | null> {
    await delay();
    const job = getStore().jobs.find((item) => item.id === id);
    return job ? scoreJob(job, profile) : null;
  }

  async getSavedJobIds(): Promise<string[]> {
    await delay();
    return getStore().savedJobIds;
  }

  async getHiddenJobIds(): Promise<string[]> {
    await delay();
    return getStore().hiddenJobIds;
  }

  async saveJob(id: string): Promise<void> {
    await delay();
    const store = getStore();
    if (!store.savedJobIds.includes(id)) store.savedJobIds.push(id);
    writeStorage(storageKeys.jobs, store);
  }

  async hideJob(id: string): Promise<void> {
    await delay();
    const store = getStore();
    if (!store.hiddenJobIds.includes(id)) store.hiddenJobIds.push(id);
    store.savedJobIds = store.savedJobIds.filter((savedId) => savedId !== id);
    writeStorage(storageKeys.jobs, store);
  }
}
