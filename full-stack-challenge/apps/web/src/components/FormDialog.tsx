import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { type FormEventHandler, type ReactNode, useId } from 'react';

export interface FormDialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  submitLabel: string;
  submitting?: boolean;
  /** A server error for the whole form, e.g. a rejected business rule. */
  error?: string | null;
  children: ReactNode;
}

/**
 * A dialog whose paper is the <form>, so Enter submits and the actions are
 * part of it. Full screen on phones. MUI's Dialog traps focus while open and
 * returns it to the opener on close.
 */
export function FormDialog({
  open,
  title,
  onClose,
  onSubmit,
  submitLabel,
  submitting = false,
  error,
  children,
}: FormDialogProps) {
  const theme = useTheme();
  const fromSm = useMediaQuery(theme.breakpoints.up('sm'));
  const titleId = useId();

  return (
    <Dialog
      open={open}
      // Closing mid-request would hide the outcome; wait for it.
      onClose={submitting ? undefined : onClose}
      fullScreen={!fromSm}
      fullWidth
      maxWidth="sm"
      aria-labelledby={titleId}
      PaperProps={{ component: 'form', noValidate: true, onSubmit }}
    >
      <DialogTitle id={titleId}>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          {children}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={submitting} sx={{ minHeight: 44 }}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={submitting}
          sx={{ minHeight: 44 }}
        >
          {submitting ? 'Saving…' : submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
