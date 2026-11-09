import type { UserProfile } from '@/domain/types';

export const sampleProfile: UserProfile = {
  fullName: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  phone: '+1 415 555 0138',
  location: 'San Francisco, CA',
  headline: 'Senior Software Engineer',
  summary: 'Full-stack engineer building reliable products with thoughtful user experiences.',
  totalExperienceYears: 6,
  skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS', 'GraphQL'],
  experiences: [
    {
      id: 'experience-1',
      company: 'Northstar Labs',
      title: 'Senior Software Engineer',
      startDate: '2022-03',
      endDate: null,
      description: 'Led product development across web applications and platform services.',
    },
    {
      id: 'experience-2',
      company: 'Brightside Systems',
      title: 'Software Engineer',
      startDate: '2019-06',
      endDate: '2022-02',
      description: 'Built customer-facing features and APIs for a cloud software platform.',
    },
  ],
  educations: [
    {
      id: 'education-1',
      institution: 'University of California, Davis',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startYear: 2015,
      endYear: 2019,
    },
  ],
  resume: { fileName: 'alex-morgan-resume.pdf', uploadedAt: '2026-10-15T12:00:00.000Z' },
};
