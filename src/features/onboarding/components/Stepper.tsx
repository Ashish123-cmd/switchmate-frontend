import type { WizardStepConfig, WizardStepId } from '@/features/onboarding/types';

interface StepperProps {
  steps: readonly WizardStepConfig[];
  currentStepId: WizardStepId;
  completedStepIds: WizardStepId[];
  onGoTo: (stepId: WizardStepId) => void;
}

export function Stepper({ steps, currentStepId, completedStepIds, onGoTo }: StepperProps) {
  return (
    <nav aria-label="Onboarding progress">
      <ol className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {steps.map((step, index) => {
          const isCurrent = step.id === currentStepId;
          const isComplete = completedStepIds.includes(step.id);

          return (
            <li key={step.id}>
              <button
                aria-current={isCurrent ? 'step' : undefined}
                className={`flex w-full items-center gap-2 rounded border px-3 py-2 text-left text-sm ${
                  isCurrent
                    ? 'border-emerald-800 bg-emerald-50 text-emerald-900'
                    : isComplete
                      ? 'border-emerald-200 bg-white text-emerald-800 hover:bg-emerald-50'
                      : 'border-slate-200 bg-white text-slate-500'
                }`}
                disabled={!isCurrent && !isComplete}
                onClick={() => onGoTo(step.id)}
                type="button"
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-current text-xs font-semibold">
                  {isComplete ? '✓' : index + 1}
                </span>
                <span className="truncate">{step.title}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
