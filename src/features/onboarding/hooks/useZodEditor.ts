import { useState, type FormEvent } from 'react';
import type { ZodType } from 'zod';

export function useZodEditor<T extends object>(
  initialValue: T,
  schema: ZodType<T>,
  onSave: (value: T) => void,
) {
  const [draft, setDraft] = useState(initialValue);
  const validation = schema.safeParse(draft);

  function update<K extends keyof T>(field: K, value: T[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function errorFor(field: keyof T): string | undefined {
    if (validation.success) return undefined;
    return validation.error.issues.find((issue) => issue.path[0] === field)?.message;
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = schema.safeParse(draft);
    if (result.success) onSave(result.data);
  }

  return { draft, update, errorFor, isValid: validation.success, submit };
}
