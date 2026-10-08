import { Alert, Snackbar } from '@mui/material';

interface NoticeSnackbarProps {
  /** The message to show; null hides it. */
  notice: string | null;
  onClose: () => void;
}

/** Confirms a finished operation; announced politely (role="status"). */
export function NoticeSnackbar({ notice, onClose }: NoticeSnackbarProps) {
  return (
    <Snackbar
      open={notice !== null}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        severity="success"
        variant="filled"
        role="status"
        onClose={onClose}
      >
        {notice}
      </Alert>
    </Snackbar>
  );
}
