import { useState } from 'react';
import type { WizardStepConfig, WizardStepId } from '@/features/onboarding/types';

export function useWizard(steps: readonly WizardStepConfig[]) {
  const [navigation, setNavigation] = useState({ currentIndex: 0, furthestIndex: 0 });
  const currentStep = steps[navigation.currentIndex];

  function next() {
    setNavigation(({ currentIndex, furthestIndex }) => {
      const nextIndex = Math.min(currentIndex + 1, steps.length - 1);
      return {
        currentIndex: nextIndex,
        furthestIndex: Math.max(furthestIndex, nextIndex),
      };
    });
  }

  function back() {
    setNavigation((state) => ({
      ...state,
      currentIndex: Math.max(0, state.currentIndex - 1),
    }));
  }

  function goTo(stepId: WizardStepId) {
    setNavigation((state) => ({
      ...state,
      currentIndex: steps.findIndex((step) => step.id === stepId),
    }));
  }

  return {
    currentStep,
    currentStepIndex: navigation.currentIndex,
    completedStepIds: steps.slice(0, navigation.furthestIndex).map((step) => step.id),
    isFirst: navigation.currentIndex === 0,
    isLast: navigation.currentIndex === steps.length - 1,
    next,
    back,
    goTo,
  };
}
