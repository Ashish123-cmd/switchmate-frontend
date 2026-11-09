import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

export type ToastKind = 'success' | 'error';

interface ToastMessage {
  id: number;
  message: string;
  kind: ToastKind;
}

interface ToastContextValue {
  showToast: (message: string, kind?: ToastKind) => void;
}

interface ToastProviderProps {
  children: ReactNode;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Map<number, number>());

  useEffect(
    () => () => {
      for (const timer of timers.current.values()) window.clearTimeout(timer);
      timers.current.clear();
    },
    [],
  );

  function dismiss(id: number) {
    const timer = timers.current.get(id);
    if (timer !== undefined) window.clearTimeout(timer);
    timers.current.delete(id);
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }

  function showToast(message: string, kind: ToastKind = 'success') {
    const id = nextId.current++;
    setToasts((current) => [...current, { id, message, kind }]);
    timers.current.set(
      id,
      window.setTimeout(() => dismiss(id), 5000),
    );
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        aria-label="Notifications"
        className="fixed bottom-4 right-4 z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2"
        role="region"
      >
        {toasts.map((toast) => (
          <div
            className={`flex items-start justify-between gap-4 rounded border px-4 py-3 text-sm shadow-lg ${
              toast.kind === 'error'
                ? 'border-rose-200 bg-white text-rose-900'
                : 'border-emerald-200 bg-white text-emerald-900'
            }`}
            key={toast.id}
            role={toast.kind === 'error' ? 'alert' : 'status'}
          >
            <p>{toast.message}</p>
            <button
              aria-label="Dismiss notification"
              className="min-h-6 min-w-6 rounded text-lg leading-none text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              onClick={() => dismiss(toast.id)}
              type="button"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}
