import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

type Severity = 'warning' | 'error' | 'success' | 'info';

const SEVERITY_CONFIG: Record<Severity, { icon: React.ReactNode; color: string }> = {
  warning: { icon: <WarningAmberIcon sx={{ fontSize: 32 }} />, color: 'warning.main' },
  error: { icon: <ErrorOutlineIcon sx={{ fontSize: 32 }} />, color: 'error.main' },
  success: { icon: <CheckCircleOutlineIcon sx={{ fontSize: 32 }} />, color: 'success.main' },
  info: { icon: <HelpOutlineIcon sx={{ fontSize: 32 }} />, color: 'info.main' },
};

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  severity?: Severity;
  loading?: boolean;
  successText?: string;
  errorText?: string;
}

function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirmar',
  severity = 'warning',
  loading = false,
  successText,
  errorText,
}: ConfirmDialogProps) {
  const { icon, color } = SEVERITY_CONFIG[severity];
  const hasFeedback = Boolean(successText || errorText);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" alignItems="center" gap={1.5}>
          <Stack sx={{ color }}>{icon}</Stack>
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        {successText && (
          <Alert severity="success" variant="outlined" sx={{ mt: 2 }}>
            {successText}
          </Alert>
        )}
        {errorText && (
          <Alert severity="error" variant="outlined" sx={{ mt: 2 }}>
            {errorText}
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        {hasFeedback ? (
          <Button variant="contained" onClick={onClose}>
            Fechar
          </Button>
        ) : (
          <>
            <Button variant="outlined" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              color={severity === 'info' ? 'primary' : severity}
              onClick={onConfirm}
              disabled={loading}
            >
              {confirmLabel}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;
