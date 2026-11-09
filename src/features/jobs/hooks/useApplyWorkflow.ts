import { useEffect, useState } from 'react';
import { useServices } from '@/app/ServicesProvider';
import type { Application, Job, StandardAnswers, UserProfile } from '@/domain/types';

export interface CopyReadyAnswer {
  id: string;
  label: string;
  value: string;
}

function displayValue(value: string): string {
  return value.trim() ? value : 'Not provided';
}

function buildCopyReadyAnswers(
  profile: UserProfile,
  standardAnswers: StandardAnswers,
): CopyReadyAnswer[] {
  const profileEntries = [
    { id: 'fullName', label: 'Full name', value: profile.fullName },
    { id: 'email', label: 'Email', value: profile.email },
    { id: 'phone', label: 'Phone', value: profile.phone },
    { id: 'location', label: 'Location', value: profile.location },
    { id: 'headline', label: 'Headline', value: profile.headline },
    { id: 'summary', label: 'Summary', value: profile.summary },
    {
      id: 'totalExperienceYears',
      label: 'Years of experience',
      value: String(profile.totalExperienceYears),
    },
    { id: 'skills', label: 'Skills', value: profile.skills.join(', ') },
    {
      id: 'resume',
      label: 'Resume',
      value: profile.resume ? profile.resume.fileName : 'Not provided',
    },
    ...profile.experiences.map((experience, index) => ({
      id: `experience-${experience.id}`,
      label: `Experience ${index + 1}`,
      value: `${experience.title} at ${experience.company}\n${experience.description}`,
    })),
    ...profile.educations.map((education, index) => ({
      id: `education-${education.id}`,
      label: `Education ${index + 1}`,
      value: `${education.degree} in ${education.field}, ${education.institution}`,
    })),
  ];
  const standardAnswerEntries = [
    {
      id: 'requiresSponsorship',
      label: 'Requires sponsorship',
      value:
        standardAnswers.requiresSponsorship === null
          ? 'Not answered'
          : standardAnswers.requiresSponsorship
            ? 'Yes'
            : 'No',
    },
    {
      id: 'willingToRelocate',
      label: 'Willing to relocate',
      value:
        standardAnswers.willingToRelocate === null
          ? 'Not answered'
          : standardAnswers.willingToRelocate
            ? 'Yes'
            : 'No',
    },
    { id: 'linkedinUrl', label: 'LinkedIn URL', value: standardAnswers.linkedinUrl },
    { id: 'githubUrl', label: 'GitHub URL', value: standardAnswers.githubUrl },
    { id: 'portfolioUrl', label: 'Portfolio URL', value: standardAnswers.portfolioUrl },
    ...Object.entries(standardAnswers.customAnswers).map(([question, answer]) => ({
      id: `custom-${question}`,
      label: question,
      value: answer,
    })),
  ];

  return [...profileEntries, ...standardAnswerEntries].map((answer) => ({
    ...answer,
    value: displayValue(answer.value),
  }));
}

interface UseApplyWorkflowOptions {
  job: Job;
}

export function useApplyWorkflow({ job }: UseApplyWorkflowOptions) {
  const { applications: applicationService, profile: profileService } = useServices();
  const [application, setApplication] = useState<Application | null>(null);
  const [copyReadyAnswers, setCopyReadyAnswers] = useState<CopyReadyAnswer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [refreshVersion, setRefreshVersion] = useState(0);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);

    async function loadApplyData() {
      try {
        const [applications, profile, standardAnswers] = await Promise.all([
          applicationService.listApplications(),
          profileService.getProfile(),
          profileService.getStandardAnswers(),
        ]);
        if (!active) return;
        setApplication(applications.find((item) => item.jobId === job.id) ?? null);
        setCopyReadyAnswers(buildCopyReadyAnswers(profile, standardAnswers));
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error ? loadError.message : 'Unable to load application details.',
          );
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void loadApplyData();
    return () => {
      active = false;
    };
  }, [applicationService, job.id, profileService, refreshVersion]);

  function refetch() {
    setRefreshVersion((version) => version + 1);
  }

  async function startApplication() {
    if (application || isStarting) return;
    setActionError(null);
    setIsStarting(true);
    window.open(job.applyUrl, '_blank', 'noopener,noreferrer');
    try {
      const createdApplication = await applicationService.createApplication(job.id, 'manual');
      setApplication(createdApplication);
      setShowConfirmation(true);
    } catch (createError) {
      setActionError(
        createError instanceof Error ? createError.message : 'Unable to record this application.',
      );
    } finally {
      setIsStarting(false);
    }
  }

  async function confirmApplied() {
    if (!application) return;
    setActionError(null);
    setIsUpdating(true);
    try {
      const updatedApplication = await applicationService.updateStatus(application.id, 'applied');
      if (!updatedApplication) throw new Error('Application record could not be found.');
      setApplication(updatedApplication);
      setShowConfirmation(false);
    } catch (updateError) {
      setActionError(
        updateError instanceof Error ? updateError.message : 'Unable to update status.',
      );
    } finally {
      setIsUpdating(false);
    }
  }

  function confirmNotApplied() {
    setShowConfirmation(false);
  }

  async function copyAnswer(answer: CopyReadyAnswer) {
    setActionError(null);
    try {
      await navigator.clipboard.writeText(answer.value);
      setCopiedId(answer.id);
    } catch {
      setActionError('Clipboard access is unavailable in this browser.');
    }
  }

  return {
    application,
    copyReadyAnswers,
    isLoading,
    isStarting,
    isUpdating,
    showConfirmation,
    copiedId,
    error,
    actionError,
    refetch,
    startApplication,
    confirmApplied,
    confirmNotApplied,
    copyAnswer,
  };
}
