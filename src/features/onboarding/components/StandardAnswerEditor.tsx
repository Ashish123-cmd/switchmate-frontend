import type { CustomAnswerItem } from '@/features/onboarding/hooks/useStandardAnswersStep';
import { Button } from '@/shared/ui/Button';
import { FormField } from '@/shared/ui/FormField';
import { Input } from '@/shared/ui/Input';
import { useZodEditor } from '@/features/onboarding/hooks/useZodEditor';
import { customAnswerSchema } from '@/features/onboarding/schemas/standardAnswersSchema';

interface StandardAnswerEditorProps {
  item: CustomAnswerItem;
  onSave: (item: CustomAnswerItem) => void;
  onCancel: () => void;
}

export function StandardAnswerEditor({ item, onSave, onCancel }: StandardAnswerEditorProps) {
  const { draft, update, errorFor, isValid, submit } = useZodEditor(
    item,
    customAnswerSchema,
    onSave,
  );

  return (
    <form className="space-y-4 rounded border border-slate-200 bg-slate-50 p-4" onSubmit={submit}>
      <FormField error={errorFor('question')} id="custom-answer-question" label="Question">
        <Input
          id="custom-answer-question"
          onChange={(event) => update('question', event.target.value)}
          placeholder="Why do you want to join?"
          value={draft.question}
        />
      </FormField>
      <FormField error={errorFor('answer')} id="custom-answer-response" label="Answer">
        <textarea
          className="min-h-24 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
          id="custom-answer-response"
          onChange={(event) => update('answer', event.target.value)}
          value={draft.answer}
        />
      </FormField>
      <div className="flex justify-end gap-2">
        <Button onClick={onCancel} type="button" variant="secondary">
          Cancel
        </Button>
        <Button disabled={!isValid} type="submit">
          Save answer
        </Button>
      </div>
    </form>
  );
}
