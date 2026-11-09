interface SpinnerProps {
  label?: string;
}

export function Spinner({ label = 'Loading' }: SpinnerProps) {
  return (
    <div
      aria-label={label}
      className="inline-flex items-center gap-3 text-sm text-slate-600"
      role="status"
    >
      <span className="size-5 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-800" />
      <span>{label}</span>
    </div>
  );
}
