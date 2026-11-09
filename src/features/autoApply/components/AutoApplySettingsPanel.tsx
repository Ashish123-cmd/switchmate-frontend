import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Spinner } from '@/shared/ui/Spinner';
import { TagInput } from '@/shared/ui/TagInput';
import { useAutoApplySettings } from '@/features/autoApply/hooks/useAutoApplySettings';

export function AutoApplySettingsPanel() {
  const { settings, isLoading, isSaving, isRunning, loadError, update, save, runNow, refetch } =
    useAutoApplySettings();

  if (isLoading) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <Spinner label="Loading auto-apply settings" />
      </div>
    );
  }

  if (loadError) {
    return (
      <Card className="space-y-3">
        <p className="text-sm text-red-700" role="alert">
          {loadError}
        </p>
        <Button onClick={refetch} type="button" variant="secondary">
          Retry
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <p className="rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        Auto-apply is simulated in this version. No applications are actually submitted
        automatically.
      </p>

      <Card className="space-y-6">
        <label className="flex items-center justify-between gap-4">
          <span>
            <span className="block text-sm font-semibold text-slate-800">Enable auto-apply</span>
            <span className="mt-1 block text-sm text-slate-600">
              Select eligible matched jobs when you run the simulation.
            </span>
          </span>
          <input
            checked={settings.enabled}
            className="size-5 accent-emerald-800"
            onChange={(event) => update('enabled', event.target.checked)}
            role="switch"
            type="checkbox"
          />
        </label>

        <div className="space-y-2">
          <label
            className="flex items-center justify-between gap-3 text-sm font-medium text-slate-700"
            htmlFor="auto-min-score"
          >
            Minimum match score
            <output className="font-semibold text-emerald-800">{settings.minMatchScore}%</output>
          </label>
          <input
            className="w-full accent-emerald-800"
            id="auto-min-score"
            max={100}
            min={0}
            onChange={(event) => update('minMatchScore', Number(event.target.value))}
            type="range"
            value={settings.minMatchScore}
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>

        <div className="max-w-xs space-y-1.5">
          <label className="block text-sm font-medium text-slate-700" htmlFor="auto-daily-cap">
            Daily application cap
          </label>
          <input
            className="min-h-10 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
            id="auto-daily-cap"
            max={100}
            min={1}
            onChange={(event) => update('dailyCap', Number(event.target.value))}
            required
            type="number"
            value={settings.dailyCap}
          />
        </div>

        <TagInput
          id="auto-excluded-companies"
          label="Excluded companies"
          onChange={(excludedCompanies) => update('excludedCompanies', excludedCompanies)}
          placeholder="Add a company to exclude"
          value={settings.excludedCompanies}
        />

        <label className="flex items-center justify-between gap-4 border-t border-slate-200 pt-5">
          <span>
            <span className="block text-sm font-semibold text-slate-800">
              Require my approval before applying
            </span>
            <span className="mt-1 block text-sm text-slate-600">
              Queue selected jobs for your review instead of marking them applied.
            </span>
          </span>
          <input
            checked={settings.requireApproval}
            className="size-5 accent-emerald-800"
            onChange={(event) => update('requireApproval', event.target.checked)}
            role="switch"
            type="checkbox"
          />
        </label>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button
          disabled={isSaving || isRunning}
          onClick={() => void save()}
          type="button"
          variant="secondary"
        >
          {isSaving ? 'Saving...' : 'Save settings'}
        </Button>
        <Button
          disabled={!settings.enabled || isSaving || isRunning || settings.dailyCap < 1}
          onClick={() => void runNow()}
          type="button"
        >
          {isRunning ? 'Running simulation...' : 'Run auto-apply now'}
        </Button>
      </div>
    </div>
  );
}
