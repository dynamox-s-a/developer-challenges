import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

export interface LoadingStateProps {
  label?: string;
}

export function LoadingState({ label = 'Carregando…' }: LoadingStateProps): JSX.Element {
  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 4, justifyContent: 'center' }}
    >
      <CircularProgress size={24} />
      <Typography color="text.secondary">{label}</Typography>
    </Box>
  );
}

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Não foi possível carregar',
  message,
  onRetry,
}: ErrorStateProps): JSX.Element {
  return (
    <Alert
      severity="error"
      action={
        onRetry ? (
          <Button color="inherit" size="small" onClick={onRetry}>
            Tentar novamente
          </Button>
        ) : undefined
      }
    >
      <AlertTitle>{title}</AlertTitle>
      {message}
    </Alert>
  );
}

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps): JSX.Element {
  return (
    <Box sx={{ py: 6, textAlign: 'center' }}>
      <Typography variant="subtitle1" gutterBottom>
        {title}
      </Typography>
      {description ? (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
      ) : null}
      {action}
    </Box>
  );
}
