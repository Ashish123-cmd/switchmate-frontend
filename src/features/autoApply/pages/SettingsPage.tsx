import { useCallback, useRef, useState, type KeyboardEvent } from 'react';
import { Button } from '@/shared/ui/Button';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Spinner } from '@/shared/ui/Spinner';
import { AutoApplySettingsPanel } from '@/features/autoApply/components/AutoApplySettingsPanel';
import {
  useSettingsFormData,
  type EditableSettingsTab,
} from '@/features/autoApply/hooks/useSettingsFormData';
import { ProfileStep } from '@/features/onboarding/components/ProfileStep';
import { PreferencesStep } from '@/features/onboarding/components/PreferencesStep';
import { StandardAnswersStep } from '@/features/onboarding/components/StandardAnswersStep';
import type { WizardData, WizardStepProps } from '@/features/onboarding/types';

type SettingsTab = EditableSettingsTab | 'auto-apply';

const tabs: { id: SettingsTab; label: string }[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'preferences', label: 'Preferences' },
  { id: 'standard-answers', label: 'Standard Answers' },
  { id: 'auto-apply', label: 'Auto-apply' },
];

interface SettingsStepPanelProps {
  tab: EditableSettingsTab;
  data: WizardData;
  isSaving: boolean;
  canSave: boolean;
  onChange: WizardStepProps['onChange'];
  onSave: () => void;
  onValidationChange?: WizardStepProps['onValidationChange'];
}

function SettingsStepPanel({
  tab,
  data,
  isSaving,
  canSave,
  onChange,
  onSave,
  onValidationChange,
}: SettingsStepPanelProps) {
  const SettingsStep =
    tab === 'profile' ? ProfileStep : tab === 'preferences' ? PreferencesStep : StandardAnswersStep;
  const stepProps: WizardStepProps = {
    data,
    onChange,
    isSubmitting: isSaving,
    showNavigation: false,
    showResumeBanner: false,
    onValidationChange,
  };

  return (
    <div className="space-y-4">
      <SettingsStep {...stepProps} />
      <div className="flex justify-end">
        <Button disabled={!canSave || isSaving} onClick={onSave} type="button">
          {isSaving ? 'Saving...' : 'Save changes'}
        </Button>
      </div>
    </div>
  );
}

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [standardAnswersValid, setStandardAnswersValid] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const { data, isLoading, isSaving, loadError, updateData, canSave, save, refetch } =
    useSettingsFormData();
  const reportStandardAnswersValidity = useCallback((isValid: boolean) => {
    setStandardAnswersValid(isValid);
  }, []);

  function activateTab(index: number) {
    const nextIndex = (index + tabs.length) % tabs.length;
    setActiveTab(tabs[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  }

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      activateTab(index + 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      activateTab(index - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      activateTab(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      activateTab(tabs.length - 1);
    }
  }

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <p className="text-sm font-semibold text-emerald-800">Your account</p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Settings</h1>
      </header>

      <div
        aria-label="Settings sections"
        className="flex gap-1 overflow-x-auto border-b border-slate-200"
        role="tablist"
      >
        {tabs.map((tab, index) => (
          <button
            aria-controls={`settings-panel-${tab.id}`}
            aria-selected={activeTab === tab.id}
            className={`min-h-11 shrink-0 border-b-2 px-3 py-2 text-sm font-medium ${
              activeTab === tab.id
                ? 'border-emerald-800 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
            id={`settings-tab-${tab.id}`}
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            onKeyDown={(event) => handleTabKeyDown(event, index)}
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            role="tab"
            tabIndex={activeTab === tab.id ? 0 : -1}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map((tab) => (
        <div
          aria-labelledby={`settings-tab-${tab.id}`}
          hidden={activeTab !== tab.id}
          id={`settings-panel-${tab.id}`}
          key={tab.id}
          role="tabpanel"
          tabIndex={0}
        >
          {tab.id === 'auto-apply' ? (
            <AutoApplySettingsPanel />
          ) : isLoading ? (
            <div className="flex min-h-48 items-center justify-center">
              <Spinner label={`Loading ${tab.label.toLocaleLowerCase()} settings`} />
            </div>
          ) : loadError ? (
            <EmptyState
              action={
                <Button onClick={refetch} type="button" variant="secondary">
                  Retry
                </Button>
              }
              description={loadError}
              title="Settings unavailable"
            />
          ) : data ? (
            <SettingsStepPanel
              canSave={
                canSave(tab.id as EditableSettingsTab) &&
                (tab.id !== 'standard-answers' || standardAnswersValid)
              }
              data={data}
              isSaving={isSaving}
              onValidationChange={
                tab.id === 'standard-answers' ? reportStandardAnswersValidity : undefined
              }
              onChange={updateData}
              onSave={() => void save(tab.id as EditableSettingsTab)}
              tab={tab.id as EditableSettingsTab}
            />
          ) : null}
        </div>
      ))}
    </section>
  );
}
