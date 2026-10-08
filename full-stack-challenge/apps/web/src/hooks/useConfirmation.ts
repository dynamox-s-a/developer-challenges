import { useState } from 'react';
import type { ApiError } from '../services/apiClient';

/**
 * State of a confirmation dialog. `open` and `target` are separate so the
 * target outlives closing: the dialog fades out still showing its text
 * instead of flashing empty.
 */
export function useConfirmation<T>() {
  const [target, setTarget] = useState<T | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return {
    target,
    isOpen,
    pending,
    error,
    open: (next: T) => {
      setError(null);
      setTarget(next);
      setIsOpen(true);
    },
    close: () => setIsOpen(false),
    /**
     * Runs the confirmed action. Closes and resolves true on success; keeps
     * the dialog open with the API error and resolves false otherwise.
     */
    run: async (action: (target: T) => Promise<unknown>): Promise<boolean> => {
      if (target === null) return false;
      setPending(true);
      setError(null);
      try {
        await action(target);
        setIsOpen(false);
        return true;
      } catch (rejected) {
        setError((rejected as ApiError).message);
        return false;
      } finally {
        setPending(false);
      }
    },
  };
}
