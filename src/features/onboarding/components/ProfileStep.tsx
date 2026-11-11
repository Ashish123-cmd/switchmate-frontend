import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { EditableList } from '@/shared/ui/EditableList';
import { FormField } from '@/shared/ui/FormField';
import { Input } from '@/shared/ui/Input';
import { TagInput } from '@/shared/ui/TagInput';
import { EducationEditor } from '@/features/onboarding/components/EducationEditor';
import { ExperienceEditor } from '@/features/onboarding/components/ExperienceEditor';
import { useProfileStep } from '@/features/onboarding/hooks/useProfileStep';
import type { WizardStepProps } from '@/features/onboarding/types';

export function ProfileStep({
  data,
  onChange,
  onNext,
  onBack,
  isFirst,
  isSubmitting,
  showNavigation = true,
  showResumeBanner = false,
}: WizardStepProps) {
  const { profile, isValid, errorFor, updateProfile, updateExperiences, updateEducations } =
    useProfileStep({ data, onChange });

  return (
    <Card className="space-y-8">
      {showResumeBanner && (
        <div className="rounded border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          We filled this from your resume, please review.
        </div>
      )}

      <section className="space-y-4" aria-labelledby="profile-basic-heading">
        <h2 className="text-lg font-semibold text-slate-900" id="profile-basic-heading">
          Basic info
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField error={errorFor('fullName')} id="profile-name" label="Full name">
            <Input
              id="profile-name"
              onChange={(event) => updateProfile('fullName', event.target.value)}
              value={profile.fullName}
            />
          </FormField>
          <FormField error={errorFor('email')} id="profile-email" label="Email">
            <Input
              id="profile-email"
              onChange={(event) => updateProfile('email', event.target.value)}
              type="email"
              value={profile.email}
            />
          </FormField>
          <FormField error={errorFor('phone')} id="profile-phone" label="Phone">
            <Input
              id="profile-phone"
              onChange={(event) => updateProfile('phone', event.target.value)}
              type="tel"
              value={profile.phone}
            />
          </FormField>
          <FormField error={errorFor('location')} id="profile-location" label="Location">
            <Input
              id="profile-location"
              onChange={(event) => updateProfile('location', event.target.value)}
              value={profile.location}
            />
          </FormField>
          <FormField error={errorFor('headline')} id="profile-headline" label="Headline">
            <Input
              id="profile-headline"
              onChange={(event) => updateProfile('headline', event.target.value)}
              value={profile.headline}
            />
          </FormField>
          <FormField
            error={errorFor('totalExperienceYears')}
            id="profile-experience-years"
            label="Years of experience"
          >
            <Input
              id="profile-experience-years"
              min={0}
              onChange={(event) =>
                updateProfile('totalExperienceYears', Number(event.target.value))
              }
              type="number"
              value={profile.totalExperienceYears}
            />
          </FormField>
        </div>
        <FormField error={errorFor('summary')} id="profile-summary" label="Summary">
          <textarea
            className="min-h-28 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
            id="profile-summary"
            onChange={(event) => updateProfile('summary', event.target.value)}
            value={profile.summary}
          />
        </FormField>
      </section>

      <section className="space-y-4" aria-labelledby="profile-skills-heading">
        <h2 className="text-lg font-semibold text-slate-900" id="profile-skills-heading">
          Skills
        </h2>
        <TagInput
          error={errorFor('skills')}
          id="profile-skill-input"
          label="Skills"
          onChange={(skills) => updateProfile('skills', skills)}
          value={profile.skills}
        />
      </section>

      <section className="space-y-4" aria-labelledby="profile-experience-heading">
        <h2 className="text-lg font-semibold text-slate-900" id="profile-experience-heading">
          Experience
        </h2>
        <EditableList
          items={profile.experiences}
          onChange={updateExperiences}
          createItem={() => ({
            id: crypto.randomUUID(),
            company: '',
            title: '',
            startDate: '',
            endDate: null,
            description: '',
          })}
          getItemLabel={(experience) => `${experience.title} at ${experience.company}`}
          itemTypeLabel="Experience"
          renderEditor={({ item, onSave, onCancel }) => (
            <ExperienceEditor key={item.id} item={item} onCancel={onCancel} onSave={onSave} />
          )}
        />
      </section>

      <section className="space-y-4" aria-labelledby="profile-education-heading">
        <h2 className="text-lg font-semibold text-slate-900" id="profile-education-heading">
          Education
        </h2>
        <EditableList
          items={profile.educations}
          onChange={updateEducations}
          createItem={() => ({
            id: crypto.randomUUID(),
            institution: '',
            degree: '',
            field: '',
            startYear: 0,
            endYear: 0,
          })}
          getItemLabel={(education) =>
            `${education.degree} in ${education.field} at ${education.institution}`
          }
          itemTypeLabel="Education"
          renderEditor={({ item, onSave, onCancel }) => (
            <EducationEditor key={item.id} item={item} onCancel={onCancel} onSave={onSave} />
          )}
        />
      </section>

      {showNavigation && (
        <div className="flex justify-between gap-3 border-t border-slate-200 pt-5">
          <Button
            disabled={isFirst || isSubmitting}
            onClick={onBack}
            type="button"
            variant="secondary"
          >
            Back
          </Button>
          <Button disabled={!isValid || isSubmitting} onClick={onNext} type="button">
            Continue
          </Button>
        </div>
      )}
    </Card>
  );
}
