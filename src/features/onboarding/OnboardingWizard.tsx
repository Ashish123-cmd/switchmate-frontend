import { Button } from '@/shared/ui/Button';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Spinner } from '@/shared/ui/Spinner';
import { Stepper } from '@/features/onboarding/components/Stepper';
import { useOnboarding } from '@/features/onboarding/hooks/useOnboarding';

export function OnboardingWizard() {
  const { wizard, data, loadError, finishError, isSubmitting, updateData, next, refetch } =
    useOnboarding();

  if (loadError) {
    return (
      <EmptyState
        title="Profile unavailable"
        description={loadError}
        action={
          <Button onClick={refetch} type="button" variant="secondary">
            Retry
          </Button>
        }
      />
    );
  }

  if (!data || !wizard.currentStep) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Spinner label="Loading onboarding" />
      </div>
    );
  }

  const StepComponent = wizard.currentStep.component;

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <header className="space-y-2">
        <p className="text-sm font-semibold text-emerald-800">Get started</p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Build your profile</h1>
      </header>
      <Stepper
        steps={wizard.steps}
        currentStepId={wizard.currentStep.id}
        completedStepIds={wizard.completedStepIds}
        onGoTo={wizard.goTo}
      />
      {finishError && (
        <p className="text-sm text-red-700" role="alert">
          {finishError}
        </p>
      )}
      <StepComponent
        data={data}
        onChange={updateData}
        onNext={() => next(data)}
        onBack={wizard.back}
        isFirst={wizard.isFirst}
        isSubmitting={isSubmitting}
        showResumeBanner={data.resumeUpload.status === 'success'}
      />
    </section>
  );
}
