import { useEffect, useState } from 'react';
import { useServices } from '@/app/ServicesProvider';
import { useToast } from '@/app/ToastProvider';
import type { AutoApplySettings } from '@/domain/types';
import { selectAutoApplyJobs } from '@/features/autoApply/utils/selectAutoApplyJobs';
import { notifyAutoApplyQueueUpdated } from '@/features/autoApply/queueEvents';
import { defaultAutoApplySettings } from '@/shared/config/defaultAutoApplySettings';

export function useAutoApplySettings() {
  const services = useServices();
  const { showToast } = useToast();
  const [settings, setSettings] = useState(defaultAutoApplySettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadVersion, setLoadVersion] = useState(0);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setLoadError(null);

    async function loadSettings() {
      try {
        const savedSettings = await services.autoApplySettings.getSettings();
        if (active) setSettings(savedSettings);
      } catch (loadError) {
        if (active) {
          const message =
            loadError instanceof Error ? loadError.message : 'Unable to load settings.';
          setLoadError(message);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void loadSettings();
    return () => {
      active = false;
    };
  }, [services.autoApplySettings, loadVersion]);

  function refetch() {
    setLoadVersion((version) => version + 1);
  }

  function update<K extends keyof AutoApplySettings>(field: K, value: AutoApplySettings[K]) {
    setSettings((current) => ({ ...current, [field]: value }));
  }

  async function save(): Promise<boolean> {
    if (!Number.isInteger(settings.dailyCap) || settings.dailyCap < 1 || settings.dailyCap > 100) {
      showToast('Daily cap must be a whole number between 1 and 100.', 'error');
      return false;
    }
    setIsSaving(true);
    try {
      await services.autoApplySettings.saveSettings(settings);
      showToast('Auto-apply settings saved.');
      return true;
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : 'Unable to save settings.';
      showToast(message, 'error');
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function runNow() {
    if (!settings.enabled) return;
    if (!Number.isInteger(settings.dailyCap) || settings.dailyCap < 1 || settings.dailyCap > 100) {
      showToast('Daily cap must be a whole number between 1 and 100.', 'error');
      return;
    }
    setIsRunning(true);
    let createdCount = 0;

    try {
      await services.autoApplySettings.saveSettings(settings);
      const [profile, applications, hiddenJobIds] = await Promise.all([
        services.profile.getProfile(),
        services.applications.listApplications(),
        services.jobs.getHiddenJobIds(),
      ]);
      const matchedJobs = await services.jobs.listMatchedJobs(profile);
      const selectedJobs = selectAutoApplyJobs({
        jobs: matchedJobs,
        settings,
        applications,
        hiddenJobIds,
        now: new Date(),
      });
      const status = settings.requireApproval ? 'queued' : 'applied';

      for (const matchedJob of selectedJobs) {
        await services.applications.createApplication(matchedJob.job.id, 'auto', status);
        createdCount += 1;
      }

      if (createdCount > 0) notifyAutoApplyQueueUpdated();
      showToast(
        createdCount === 0
          ? 'Simulation complete. No eligible jobs were found within today’s cap.'
          : `Simulation complete. ${createdCount} application${createdCount === 1 ? '' : 's'} ${status === 'queued' ? 'queued for approval' : 'marked applied'}.`,
      );
      showToast('Auto-apply simulation finished.');
    } catch (runError) {
      const message =
        runError instanceof Error
          ? `${runError.message}${createdCount ? ` ${createdCount} application(s) were created before the error.` : ''}`
          : 'Unable to run the auto-apply simulation.';
      showToast(message, 'error');
    } finally {
      setIsRunning(false);
    }
  }

  return {
    settings,
    isLoading,
    isSaving,
    isRunning,
    loadError,
    update,
    save,
    runNow,
    refetch,
  };
}
