import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className = '', label, ...props },
  ref,
) {
  const input = (
    <input
      ref={ref}
      className={`min-h-10 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15 ${className}`}
      {...props}
    />
  );

  return label ? (
    <label className="block space-y-1.5 text-sm font-medium text-slate-700">
      <span>{label}</span>
      {input}
    </label>
  ) : (
    input
  );
});
