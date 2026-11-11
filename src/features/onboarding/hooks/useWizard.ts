import { useEffect, useMemo, useState } from 'react';
import type { UserProfile } from '@/domain/types';
import type { WizardStepConfig, WizardStepId } from '@/features/onboarding/types';

export function useWizard(steps: readonly WizardStepConfig[], profile: UserProfile | null) {
  const visibleSteps = useMemo(
    () => (profile ? steps.filter((step) => !step.isSkipped?.(profile)) : [...steps]),
    [steps, profile],
  );
  const [navigation, setNavigation] = useState({ currentId: visibleSteps[0]?.id, furthestIndex: 0 });

  useEffect(() => {
    setNavigation((state) => {
      const currentIndex = state.currentId
        ? visibleSteps.findIndex((step) => step.id === state.currentId)
        : -1;
      const resolvedCurrentId =
        currentIndex >= 0 ? visibleSteps[currentIndex].id : visibleSteps[0]?.id;
      const resolvedIndex = resolvedCurrentId
        ? visibleSteps.findIndex((step) => step.id === resolvedCurrentId)
        : -1;
      const furthestIndex = Math.min(state.furthestIndex, Math.max(visibleSteps.length - 1, 0));
      return {
        currentId: resolvedCurrentId,
        furthestIndex: Math.max(furthestIndex, resolvedIndex >= 0 ? resolvedIndex : 0),
      };
    });
  }, [visibleSteps]);

  const currentIndex = Math.max(
    0,
    visibleSteps.findIndex((step) => step.id === navigation.currentId),
  );
  const currentStep = visibleSteps[currentIndex];

  function next() {
    setNavigation((state) => {
      const index = Math.max(
        0,
        visibleSteps.findIndex((step) => step.id === state.currentId),
      );
      const nextIndex = Math.min(index + 1, visibleSteps.length - 1);
      return {
        currentId: visibleSteps[nextIndex]?.id,
        furthestIndex: Math.max(state.furthestIndex, nextIndex),
      };
    });
  }

  function back() {
    setNavigation((state) => {
      const index = Math.max(
        0,
        visibleSteps.findIndex((step) => step.id === state.currentId),
      );
      const prevIndex = Math.max(0, index - 1);
      return { ...state, currentId: visibleSteps[prevIndex]?.id };
    });
  }

  function goTo(stepId: WizardStepId) {
    const targetIndex = visibleSteps.findIndex((step) => step.id === stepId);
    if (targetIndex < 0 || targetIndex > navigation.furthestIndex) return;
    setNavigation((state) => ({ ...state, currentId: stepId }));
  }

  return {
    steps: visibleSteps,
    currentStep,
    currentStepIndex: currentIndex,
    completedStepIds: visibleSteps.slice(0, navigation.furthestIndex).map((step) => step.id),
    isFirst: currentIndex === 0,
    isLast: visibleSteps.length > 0 && currentIndex === visibleSteps.length - 1,
    next,
    back,
    goTo,
  };
}
