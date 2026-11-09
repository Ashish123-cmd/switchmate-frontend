export const AUTO_APPLY_QUEUE_UPDATED = 'switchmate:auto-apply-queue-updated';

export function notifyAutoApplyQueueUpdated(): void {
  window.dispatchEvent(new Event(AUTO_APPLY_QUEUE_UPDATED));
}
