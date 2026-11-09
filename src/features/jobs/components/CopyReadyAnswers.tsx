import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import type { CopyReadyAnswer } from '@/features/jobs/hooks/useApplyWorkflow';

interface CopyReadyAnswersProps {
  answers: CopyReadyAnswer[];
  copiedId: string | null;
  onCopy: (answer: CopyReadyAnswer) => void;
}

export function CopyReadyAnswers({ answers, copiedId, onCopy }: CopyReadyAnswersProps) {
  return (
    <Card className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Copy-ready answers</h2>
        <p className="mt-1 text-sm text-slate-600">
          Copy a saved profile or standard answer for this application.
        </p>
      </div>
      <dl className="divide-y divide-slate-200">
        {answers.map((answer) => (
          <div className="flex flex-wrap items-start justify-between gap-3 py-3" key={answer.id}>
            <div className="min-w-0 flex-1 space-y-1">
              <dt className="text-xs font-semibold uppercase text-slate-500">{answer.label}</dt>
              <dd className="whitespace-pre-line break-words text-sm text-slate-800">
                {answer.value}
              </dd>
            </div>
            <Button
              aria-label={
                copiedId === answer.id ? `${answer.label} copied` : `Copy ${answer.label}`
              }
              onClick={() => onCopy(answer)}
              type="button"
              variant="secondary"
            >
              {copiedId === answer.id ? 'Copied' : 'Copy'}
            </Button>
          </div>
        ))}
      </dl>
    </Card>
  );
}
