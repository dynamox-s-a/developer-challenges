import { useEffect } from 'react';
import {
  Alert,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchHealth } from './health.slice';

type StatusChipProps = {
  label: string;
  value: string;
};

// Componente pequeno e reutilizável: verde se "ok", vermelho se não
function StatusChip({ label, value }: StatusChipProps) {
  return (
    <Chip
      label={`${label}: ${value}`}
      color={value === 'ok' ? 'success' : 'error'}
    />
  );
}

export function HealthPage() {
  const dispatch = useAppDispatch();
  const { data, status, error } = useAppSelector((state) => state.health);

  // Roda uma vez quando a página abre: pede ao Redux para buscar o status
  useEffect(() => {
    dispatch(fetchHealth());
  }, [dispatch]);

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Status do sistema</Typography>

      <Card sx={{ maxWidth: 480 }}>
        <CardContent>
          {error && <Alert severity="error">{error}</Alert>}

          {status === 'loading' && <CircularProgress />}

          {data && (
            <Stack direction="row" spacing={1}>
              <StatusChip label="API" value={data.api} />
              <StatusChip label="Banco" value={data.database} />
            </Stack>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}