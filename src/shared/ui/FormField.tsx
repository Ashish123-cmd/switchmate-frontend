import type { ReactNode } from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}

export function FormField({ id, label, error, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700" htmlFor={id}>
        {label}
      </label>
      {children}
      {error && (
        <p className="text-sm text-red-700" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
