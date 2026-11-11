import { forwardRef, useState, type InputHTMLAttributes } from 'react';

interface PasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  revealed?: boolean;
  onRevealedChange?: (revealed: boolean) => void;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(function PasswordField(
  { className = '', revealed, onRevealedChange, disabled, ...props },
  ref,
) {
  const [internalRevealed, setInternalRevealed] = useState(false);
  const isControlled = typeof revealed === 'boolean';
  const isRevealed = isControlled ? revealed : internalRevealed;

  function setRevealed(next: boolean) {
    if (!isControlled) setInternalRevealed(next);
    onRevealedChange?.(next);
  }

  return (
    <div className="relative">
      <input
        ref={ref}
        className={`min-h-10 w-full rounded border border-slate-300 bg-white px-3 py-2 pr-11 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15 ${className}`}
        disabled={disabled}
        type={isRevealed ? 'text' : 'password'}
        {...props}
      />
      <button
        aria-label={isRevealed ? 'Hide password' : 'Show password'}
        aria-pressed={isRevealed}
        className="absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
        disabled={disabled}
        onClick={() => setRevealed(!isRevealed)}
        type="button"
      >
        {isRevealed ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
});

function EyeIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M3 3l18 18" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M10.6 10.7a2.5 2.5 0 0 0 3.4 3.4M9.9 5.2A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a17.7 17.7 0 0 1-4.1 4.9M6.2 6.2C3.6 8 2 12 2 12s3.5 7 10 7c1.7 0 3.2-.4 4.6-1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
