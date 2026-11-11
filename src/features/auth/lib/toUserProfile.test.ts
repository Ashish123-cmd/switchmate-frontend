import { describe, expect, it } from 'vitest';
import type { ParsedProfile } from '@/domain/types';
import { toUserProfile } from '@/features/auth/lib/toUserProfile';

const parsedProfile: ParsedProfile = {
  name: 'Alex Morgan',
  phone: '+1 555 010 1234',
  location: 'Seattle, WA',
  headline: 'Software Engineer',
  summary: 'Builds reliable web applications.',
  totalExperienceYears: 5,
  skills: ['Java', 'Spring Boot'],
  experiences: [
    {
      company: 'Example Company',
      title: 'Software Engineer',
      startDate: '2021-03-01',
      endDate: '2024-06-30',
      description: 'Built backend services.',
    },
  ],
  educations: [
    {
      institution: 'Example University',
      degree: 'BS',
      field: 'Computer Science',
      startYear: 2016,
      endYear: 2020,
    },
  ],
};

describe('toUserProfile', () => {
  it('maps the backend parsed profile to the UI profile shape', () => {
    const profile = toUserProfile(parsedProfile);

    expect(profile.fullName).toBe('Alex Morgan');
    expect(profile.headline).toBe('Software Engineer');
    expect(profile.totalExperienceYears).toBe(5);
    expect(profile.skills).toEqual(['Java', 'Spring Boot']);
    expect(profile.experiences[0]).toMatchObject({
      company: 'Example Company',
      startDate: '2021-03',
      endDate: '2024-06',
    });
    expect(profile.educations[0]).toMatchObject({
      institution: 'Example University',
      startYear: 2016,
      endYear: 2020,
    });
    expect(profile.onboardingCompleted).toBe(false);
  });

  it('leaves email blank and attaches resume metadata for the uploaded file', () => {
    const profile = toUserProfile(parsedProfile, { name: 'alex.pdf' } as File);

    expect(profile.email).toBe('');
    expect(profile.resume?.fileName).toBe('alex.pdf');
    expect(profile.resume?.uploadedAt).toBeTruthy();
  });

  it('generates ids and tolerates null collections and open-ended roles', () => {
    const profile = toUserProfile({
      ...parsedProfile,
      experiences: [{ ...parsedProfile.experiences![0], endDate: null }],
      educations: null,
      skills: null,
    });

    expect(profile.experiences[0].id).toBeTruthy();
    expect(profile.experiences[0].endDate).toBeNull();
    expect(profile.educations).toEqual([]);
    expect(profile.skills).toEqual([]);
  });
});
