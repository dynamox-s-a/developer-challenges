import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import type { SxProps, Theme } from '@mui/material/styles';

export interface RetryAlertProps {
  /** Why the load failed, as the API or the network said it. */
  message: string | null;
  onRetry: () => void;
  sx?: SxProps<Theme>;
}

/**
 * A load that failed, with the way out beside the reason: the user asks again without
 * reloading the page.
 */
export function RetryAlert({ message, onRetry, sx }: RetryAlertProps) {
  return (
    <Alert
      severity="error"
      sx={sx}
      action={
        <Button color="inherit" size="small" onClick={onRetry}>
          Retry
        </Button>
      }
    >
      {message}
    </Alert>
  );
}
