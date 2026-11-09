import { useState } from 'react';
import { useServices } from '@/app/ServicesProvider';
import type { StandardAnswers } from '@/domain/types';
import type { WizardStepProps } from '@/features/onboarding/types';
import { standardAnswersSchema } from '@/features/onboarding/schemas/standardAnswersSchema';

export interface CustomAnswerItem {
  id: string;
  question: string;
  answer: string;
}

export function useStandardAnswersStep({
  data,
  onChange,
  onNext,
}: Pick<WizardStepProps, 'data' | 'onChange' | 'onNext'>) {
  const { profile } = useServices();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [customAnswerError, setCustomAnswerError] = useState<string | null>(null);
  const answers = data.standardAnswers;
  const validation = standardAnswersSchema.safeParse(answers);
  const issues = validation.success ? [] : validation.error.issues;

  function errorFor(field: keyof StandardAnswers): string | undefined {
    return issues.find((issue) => issue.path[0] === field)?.message;
  }

  function update<K extends keyof StandardAnswers>(field: K, value: StandardAnswers[K]) {
    onChange({ standardAnswers: { ...answers, [field]: value } });
  }

  function updateCustomAnswers(items: CustomAnswerItem[]) {
    const questions = items.map((item) => item.question.trim().toLocaleLowerCase());
    if (new Set(questions).size !== questions.length) {
      setCustomAnswerError('Each custom question must be unique.');
      return;
    }
    setCustomAnswerError(null);
    const customAnswers = Object.fromEntries(
      items.map(({ question, answer }) => [question, answer]),
    );
    update('customAnswers', customAnswers);
  }

  async function saveAndFinish() {
    const result = standardAnswersSchema.safeParse(answers);
    if (!result.success) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      await profile.saveStandardAnswers(result.data);
      onNext?.();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Unable to save your answers.');
    } finally {
      setIsSaving(false);
    }
  }

  const customAnswerItems = Object.entries(answers.customAnswers).map(([question, answer]) => ({
    id: question,
    question,
    answer,
  }));

  return {
    answers,
    customAnswerItems,
    isValid: validation.success && !customAnswerError,
    isSaving,
    saveError,
    customAnswerError,
    errorFor,
    update,
    updateCustomAnswers,
    saveAndFinish,
  };
}
