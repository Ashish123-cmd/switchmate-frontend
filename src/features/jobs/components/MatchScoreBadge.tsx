interface MatchScoreBadgeProps {
  score: number;
}

function scoreColor(score: number): string {
  if (score >= 80) return 'bg-emerald-50 text-emerald-800';
  if (score >= 60) return 'bg-amber-50 text-amber-900';
  return 'bg-rose-50 text-rose-800';
}

export function MatchScoreBadge({ score }: MatchScoreBadgeProps) {
  return (
    <span className={`inline-flex rounded px-2.5 py-1 text-sm font-semibold ${scoreColor(score)}`}>
      {score}% match
    </span>
  );
}
