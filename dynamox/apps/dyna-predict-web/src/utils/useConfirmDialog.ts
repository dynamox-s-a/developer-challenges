import { useCallback, useRef, useState } from 'react';
import type { ConfirmDialogProps } from '../components/ConfirmDialog';

type ConfirmOptions = Pick<
  ConfirmDialogProps,
  'title' | 'description' | 'confirmLabel' | 'severity'
>;

export function useConfirmDialog() {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({
    title: '',
    description: '',
  });
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    setOptions(opts);
    setOpen(true);
    return new Promise((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setOpen(false);
    resolveRef.current?.(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    resolveRef.current?.(false);
  }, []);

  const dialogProps: Pick<
    ConfirmDialogProps,
    'open' | 'onClose' | 'onConfirm' | 'title' | 'description' | 'confirmLabel' | 'severity'
  > = {
    open,
    onClose: handleClose,
    onConfirm: handleConfirm,
    ...options,
  };

  return { confirm, dialogProps };
}
