import { useEffect } from 'react';
import type { StandardAnswers } from '@/domain/types';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { EditableList } from '@/shared/ui/EditableList';
import { FormField } from '@/shared/ui/FormField';
import { Input } from '@/shared/ui/Input';
import { StandardAnswerEditor } from '@/features/onboarding/components/StandardAnswerEditor';
import { useStandardAnswersStep } from '@/features/onboarding/hooks/useStandardAnswersStep';
import type { WizardStepProps } from '@/features/onboarding/types';

export function StandardAnswersStep({
  data,
  onChange,
  onBack,
  isFirst,
  isSubmitting,
  onNext,
  showNavigation = true,
  onValidationChange,
}: WizardStepProps) {
  const {
    answers,
    customAnswerItems,
    isValid,
    isSaving,
    saveError,
    customAnswerError,
    errorFor,
    update,
    updateCustomAnswers,
    saveAndFinish,
  } = useStandardAnswersStep({ data, onChange, onNext });

  useEffect(() => {
    onValidationChange?.(isValid);
  }, [isValid, onValidationChange]);

  function updateAnswer<K extends keyof StandardAnswers>(field: K, value: StandardAnswers[K]) {
    update(field, value);
  }

  return (
    <Card className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">Standard answers</h2>
        <p className="text-sm text-slate-600">
          These answers will be reused to fill application forms.
        </p>
      </div>

      <section className="space-y-5" aria-label="Eligibility and relocation questions">
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-slate-700">
            Will you require sponsorship to work?
          </legend>
          <div className="flex gap-5">
            {[
              { label: 'Yes', value: true },
              { label: 'No', value: false },
            ].map((option) => (
              <label
                className="inline-flex items-center gap-2 text-sm text-slate-700"
                key={option.label}
              >
                <input
                  checked={answers.requiresSponsorship === option.value}
                  className="size-4 accent-emerald-800"
                  name="requires-sponsorship"
                  onChange={() => updateAnswer('requiresSponsorship', option.value)}
                  type="radio"
                />
                {option.label}
              </label>
            ))}
          </div>
          {errorFor('requiresSponsorship') && (
            <p className="text-sm text-red-700" role="alert">
              {errorFor('requiresSponsorship')}
            </p>
          )}
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-slate-700">
            Are you willing to relocate?
          </legend>
          <div className="flex gap-5">
            {[
              { label: 'Yes', value: true },
              { label: 'No', value: false },
            ].map((option) => (
              <label
                className="inline-flex items-center gap-2 text-sm text-slate-700"
                key={option.label}
              >
                <input
                  checked={answers.willingToRelocate === option.value}
                  className="size-4 accent-emerald-800"
                  name="willing-to-relocate"
                  onChange={() => updateAnswer('willingToRelocate', option.value)}
                  type="radio"
                />
                {option.label}
              </label>
            ))}
          </div>
          {errorFor('willingToRelocate') && (
            <p className="text-sm text-red-700" role="alert">
              {errorFor('willingToRelocate')}
            </p>
          )}
        </fieldset>
      </section>

      <section className="grid gap-4 sm:grid-cols-2" aria-label="Profile links">
        <FormField error={errorFor('linkedinUrl')} id="standard-linkedin" label="LinkedIn URL">
          <Input
            id="standard-linkedin"
            onChange={(event) => updateAnswer('linkedinUrl', event.target.value)}
            placeholder="https://linkedin.com/in/you"
            type="url"
            value={answers.linkedinUrl}
          />
        </FormField>
        <FormField error={errorFor('githubUrl')} id="standard-github" label="GitHub URL">
          <Input
            id="standard-github"
            onChange={(event) => updateAnswer('githubUrl', event.target.value)}
            placeholder="https://github.com/you"
            type="url"
            value={answers.githubUrl}
          />
        </FormField>
        <FormField error={errorFor('portfolioUrl')} id="standard-portfolio" label="Portfolio URL">
          <Input
            id="standard-portfolio"
            onChange={(event) => updateAnswer('portfolioUrl', event.target.value)}
            placeholder="https://your-site.com"
            type="url"
            value={answers.portfolioUrl}
          />
        </FormField>
      </section>

      <section className="space-y-4" aria-labelledby="custom-answers-heading">
        <h3 className="text-lg font-semibold text-slate-900" id="custom-answers-heading">
          Custom answers
        </h3>
        <EditableList
          items={customAnswerItems}
          onChange={updateCustomAnswers}
          createItem={() => ({ id: crypto.randomUUID(), question: '', answer: '' })}
          getItemLabel={(item) => item.question}
          itemTypeLabel="Question and answer"
          renderEditor={({ item, onSave, onCancel }) => (
            <StandardAnswerEditor key={item.id} item={item} onCancel={onCancel} onSave={onSave} />
          )}
        />
        {customAnswerError && (
          <p className="text-sm text-red-700" role="alert">
            {customAnswerError}
          </p>
        )}
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
            onClick={saveAndFinish}
            type="button"
          >
            {isSaving || isSubmitting ? 'Finishing...' : 'Finish'}
          </Button>
        </div>
      )}
    </Card>
  );
}
