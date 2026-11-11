import type { ParsedProfile, UserProfile } from '@/domain/types';

function text(value: string | null): string {
  return value ?? '';
}

function year(value: number | null): number {
  return value ?? 0;
}

/** Converts the backend `parsedProfile` (yyyy-MM-dd dates, no ids/email) to the UI profile shape. */
export function toUserProfile(parsedProfile: ParsedProfile, file?: File): UserProfile {
  return {
    fullName: text(parsedProfile.name),
    email: '',
    phone: text(parsedProfile.phone),
    location: text(parsedProfile.location),
    headline: text(parsedProfile.headline),
    summary: text(parsedProfile.summary),
    totalExperienceYears: parsedProfile.totalExperienceYears ?? 0,
    skills: parsedProfile.skills ?? [],
    experiences: (parsedProfile.experiences ?? []).map((experience) => ({
      id: crypto.randomUUID(),
      company: text(experience.company),
      title: text(experience.title),
      startDate: toMonth(experience.startDate),
      endDate: experience.endDate ? toMonth(experience.endDate) : null,
      description: text(experience.description),
    })),
    educations: (parsedProfile.educations ?? []).map((education) => ({
      id: crypto.randomUUID(),
      institution: text(education.institution),
      degree: text(education.degree),
      field: text(education.field),
      startYear: year(education.startYear),
      endYear: year(education.endYear),
    })),
    resume: file ? { fileName: file.name, uploadedAt: new Date().toISOString() } : null,
    onboardingCompleted: false,
  };
}

function toMonth(value: string | null): string {
  if (!value) return '';
  return /^\d{4}-\d{2}/.test(value) ? value.slice(0, 7) : value;
}
