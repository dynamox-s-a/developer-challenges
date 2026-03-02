import { useSyncExternalStore } from 'react';

type Severity = 'success' | 'error' | 'warning' | 'info';

interface NotificationState {
  message: string;
  severity: Severity;
  open: boolean;
}

let state: NotificationState = { message: '', severity: 'info', open: false };
const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((l) => l());
}

export function notify(message: string, severity: Severity = 'info') {
  state = { message, severity, open: true };
  emitChange();
}

export function useNotifications() {
  const notification = useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => state,
  );

  const close = () => {
    state = { ...state, open: false };
    emitChange();
  };

  return { ...notification, close };
}
