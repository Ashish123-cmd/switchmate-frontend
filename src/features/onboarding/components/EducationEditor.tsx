import type { Education } from '@/domain/types';
import { Button } from '@/shared/ui/Button';
import { FormField } from '@/shared/ui/FormField';
import { Input } from '@/shared/ui/Input';
import { educationSchema } from '@/features/onboarding/schemas/profileSchema';
import { useZodEditor } from '@/features/onboarding/hooks/useZodEditor';

interface EducationEditorProps {
  item: Education;
  onSave: (item: Education) => void;
  onCancel: () => void;
}

export function EducationEditor({ item, onSave, onCancel }: EducationEditorProps) {
  const { draft, update, errorFor, isValid, submit } = useZodEditor(item, educationSchema, onSave);

  return (
    <form className="space-y-4 rounded border border-slate-200 bg-slate-50 p-4" onSubmit={submit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField error={errorFor('institution')} id="education-institution" label="Institution">
          <Input
            id="education-institution"
            onChange={(event) => update('institution', event.target.value)}
            value={draft.institution}
          />
        </FormField>
        <FormField error={errorFor('degree')} id="education-degree" label="Degree">
          <Input
            id="education-degree"
            onChange={(event) => update('degree', event.target.value)}
            value={draft.degree}
          />
        </FormField>
        <FormField error={errorFor('field')} id="education-field" label="Field of study">
          <Input
            id="education-field"
            onChange={(event) => update('field', event.target.value)}
            value={draft.field}
          />
        </FormField>
        <FormField error={errorFor('startYear')} id="education-start" label="Start year">
          <Input
            id="education-start"
            min={1900}
            onChange={(event) => update('startYear', Number(event.target.value))}
            type="number"
            value={draft.startYear}
          />
        </FormField>
        <FormField error={errorFor('endYear')} id="education-end" label="End year">
          <Input
            id="education-end"
            min={1900}
            onChange={(event) => update('endYear', Number(event.target.value))}
            type="number"
            value={draft.endYear}
          />
        </FormField>
      </div>
      <div className="flex justify-end gap-2">
        <Button onClick={onCancel} type="button" variant="secondary">
          Cancel
        </Button>
        <Button disabled={!isValid} type="submit">
          Save education
        </Button>
      </div>
    </form>
  );
}
