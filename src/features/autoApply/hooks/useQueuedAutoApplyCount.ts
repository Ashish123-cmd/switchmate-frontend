import { useEffect, useState } from 'react';
import { useServices } from '@/app/ServicesProvider';
import { AUTO_APPLY_QUEUE_UPDATED } from '@/features/autoApply/queueEvents';

export function useQueuedAutoApplyCount(): number {
  const { applications } = useServices();
  const [count, setCount] = useState(0);

  useEffect(() => {
    let active = true;

    async function refreshCount() {
      try {
        const allApplications = await applications.listApplications();
        if (active) {
          setCount(
            allApplications.filter(
              (application) => application.mode === 'auto' && application.status === 'queued',
            ).length,
          );
        }
      } catch {
        if (active) setCount(0);
      }
    }

    const refresh = () => void refreshCount();
    refresh();
    window.addEventListener(AUTO_APPLY_QUEUE_UPDATED, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      active = false;
      window.removeEventListener(AUTO_APPLY_QUEUE_UPDATED, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [applications]);

  return count;
}
