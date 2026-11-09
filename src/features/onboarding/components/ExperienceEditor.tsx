import type { Experience } from '@/domain/types';
import { Button } from '@/shared/ui/Button';
import { FormField } from '@/shared/ui/FormField';
import { Input } from '@/shared/ui/Input';
import { experienceSchema } from '@/features/onboarding/schemas/profileSchema';
import { useZodEditor } from '@/features/onboarding/hooks/useZodEditor';

interface ExperienceEditorProps {
  item: Experience;
  onSave: (item: Experience) => void;
  onCancel: () => void;
}

export function ExperienceEditor({ item, onSave, onCancel }: ExperienceEditorProps) {
  const { draft, update, errorFor, isValid, submit } = useZodEditor(item, experienceSchema, onSave);

  return (
    <form className="space-y-4 rounded border border-slate-200 bg-slate-50 p-4" onSubmit={submit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField error={errorFor('company')} id="experience-company" label="Company">
          <Input
            id="experience-company"
            onChange={(event) => update('company', event.target.value)}
            value={draft.company}
          />
        </FormField>
        <FormField error={errorFor('title')} id="experience-title" label="Job title">
          <Input
            id="experience-title"
            onChange={(event) => update('title', event.target.value)}
            value={draft.title}
          />
        </FormField>
        <FormField error={errorFor('startDate')} id="experience-start" label="Start date">
          <Input
            id="experience-start"
            onChange={(event) => update('startDate', event.target.value)}
            type="month"
            value={draft.startDate}
          />
        </FormField>
        <FormField error={errorFor('endDate')} id="experience-end" label="End date">
          <Input
            id="experience-end"
            onChange={(event) => update('endDate', event.target.value || null)}
            type="month"
            value={draft.endDate ?? ''}
          />
        </FormField>
      </div>
      <FormField error={errorFor('description')} id="experience-description" label="Description">
        <textarea
          className="min-h-24 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
          id="experience-description"
          onChange={(event) => update('description', event.target.value)}
          value={draft.description}
        />
      </FormField>
      <div className="flex justify-end gap-2">
        <Button onClick={onCancel} type="button" variant="secondary">
          Cancel
        </Button>
        <Button disabled={!isValid} type="submit">
          Save experience
        </Button>
      </div>
    </form>
  );
}
