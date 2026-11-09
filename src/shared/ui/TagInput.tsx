import { useState, type KeyboardEvent } from 'react';
import { Button } from '@/shared/ui/Button';
import { FormField } from '@/shared/ui/FormField';
import { Input } from '@/shared/ui/Input';

interface TagInputProps {
  id: string;
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
  placeholder?: string;
}

export function TagInput({
  id,
  label,
  value,
  onChange,
  error,
  placeholder = 'Type a value and press Enter',
}: TagInputProps) {
  const [draft, setDraft] = useState('');

  function addTag() {
    const tag = draft.trim();
    if (!tag || value.some((item) => item.toLocaleLowerCase() === tag.toLocaleLowerCase())) return;
    onChange([...value, tag]);
    setDraft('');
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      addTag();
    }
  }

  function removeTag(tagToRemove: string) {
    onChange(value.filter((tag) => tag !== tagToRemove));
  }

  return (
    <FormField id={id} label={label} error={error}>
      <div className="space-y-3">
        {value.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {value.map((tag) => (
              <li
                className="inline-flex items-center gap-2 rounded border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-800"
                key={tag}
              >
                {tag}
                <button
                  aria-label={`Remove ${tag}`}
                  className="font-semibold text-slate-500 hover:text-red-700"
                  onClick={() => removeTag(tag)}
                  type="button"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex flex-wrap items-end gap-2">
          <Input
            id={id}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            value={draft}
          />
          <Button onClick={addTag} type="button" variant="secondary">
            Add
          </Button>
        </div>
      </div>
    </FormField>
  );
}
