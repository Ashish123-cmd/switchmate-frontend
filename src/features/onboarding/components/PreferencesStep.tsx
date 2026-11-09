import type { JobPreferences } from '@/domain/types';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { FormField } from '@/shared/ui/FormField';
import { Input } from '@/shared/ui/Input';
import { TagInput } from '@/shared/ui/TagInput';
import { usePreferencesStep } from '@/features/onboarding/hooks/usePreferencesStep';
import type { WizardStepProps } from '@/features/onboarding/types';

export function PreferencesStep({
  data,
  onChange,
  onBack,
  isFirst,
  isSubmitting,
  onNext,
  showNavigation = true,
}: WizardStepProps) {
  const { preferences, isValid, isSaving, saveError, errorFor, update, saveAndContinue } =
    usePreferencesStep({ data, onChange, onNext });

  function updatePreference<K extends keyof JobPreferences>(field: K, value: JobPreferences[K]) {
    update(field, value);
  }

  return (
    <Card className="space-y-8">
      <section className="space-y-4" aria-labelledby="preference-targets-heading">
        <h2 className="text-lg font-semibold text-slate-900" id="preference-targets-heading">
          Target roles and locations
        </h2>
        <TagInput
          error={errorFor('roles')}
          id="preference-roles"
          label="Target roles"
          onChange={(roles) => updatePreference('roles', roles)}
          placeholder="e.g. Frontend Engineer"
          value={preferences.roles}
        />
        <TagInput
          error={errorFor('locations')}
          id="preference-locations"
          label="Locations"
          onChange={(locations) => updatePreference('locations', locations)}
          placeholder="e.g. Remote, US"
          value={preferences.locations}
        />
      </section>

      <section className="space-y-4" aria-labelledby="preference-experience-heading">
        <h2 className="text-lg font-semibold text-slate-900" id="preference-experience-heading">
          Experience range
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            error={errorFor('minExperience')}
            id="preference-min-experience"
            label="Minimum years"
          >
            <Input
              id="preference-min-experience"
              min={0.1}
              onChange={(event) => updatePreference('minExperience', Number(event.target.value))}
              step="any"
              type="number"
              value={preferences.minExperience}
            />
          </FormField>
          <FormField
            error={errorFor('maxExperience')}
            id="preference-max-experience"
            label="Maximum years"
          >
            <Input
              id="preference-max-experience"
              min={0.1}
              onChange={(event) => updatePreference('maxExperience', Number(event.target.value))}
              step="any"
              type="number"
              value={preferences.maxExperience}
            />
          </FormField>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2" aria-label="Additional preferences">
        <FormField
          error={errorFor('noticePeriodDays')}
          id="preference-notice"
          label="Notice period (days)"
        >
          <Input
            id="preference-notice"
            min={1}
            onChange={(event) => updatePreference('noticePeriodDays', Number(event.target.value))}
            step={1}
            type="number"
            value={preferences.noticePeriodDays}
          />
        </FormField>
        <FormField
          error={errorFor('expectedCtcLpa')}
          id="preference-ctc"
          label="Expected CTC (LPA)"
        >
          <Input
            id="preference-ctc"
            min={0.1}
            onChange={(event) => updatePreference('expectedCtcLpa', Number(event.target.value))}
            step="any"
            type="number"
            value={preferences.expectedCtcLpa}
          />
        </FormField>
        <FormField
          error={errorFor('workAuthorization')}
          id="preference-work-authorization"
          label="Work authorization"
        >
          <select
            className="min-h-10 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
            id="preference-work-authorization"
            onChange={(event) => updatePreference('workAuthorization', event.target.value)}
            value={preferences.workAuthorization}
          >
            <option value="">Select an option</option>
            <option value="authorized">Authorized to work</option>
            <option value="requires-sponsorship">Requires sponsorship</option>
            <option value="other">Other</option>
          </select>
        </FormField>
        <label className="flex min-h-10 items-center gap-3 self-end text-sm font-medium text-slate-700">
          <input
            checked={preferences.openToRelocation}
            className="size-4 accent-emerald-800"
            onChange={(event) => updatePreference('openToRelocation', event.target.checked)}
            role="switch"
            type="checkbox"
          />
          Open to relocation
        </label>
      </section>

      {saveError && (
        <p className="text-sm text-red-700" role="alert">
          {saveError}
        </p>
      )}

      {showNavigation && (
        <div className="flex justify-between gap-3 border-t border-slate-200 pt-5">
          <Button
            disabled={isFirst || isSubmitting || isSaving}
            onClick={onBack}
            type="button"
            variant="secondary"
          >
            Back
          </Button>
          <Button
            disabled={!isValid || isSubmitting || isSaving}
            onClick={saveAndContinue}
            type="button"
          >
            {isSaving ? 'Saving...' : 'Continue'}
          </Button>
        </div>
      )}
    </Card>
  );
}
