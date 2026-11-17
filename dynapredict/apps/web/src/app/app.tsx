import { useEffect, useState } from 'react';
import {
  Alert,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from '@mui/material';

type HealthStatus = {
  api: string;
  database: string;
};

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

export function App() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Roda uma vez quando a tela abre: busca o status na API
  useEffect(() => {
    fetch('/api/health')
      .then((response) => response.json())
      .then((data: HealthStatus) => setHealth(data))
      .catch(() => setError('Não foi possível falar com a API'));
  }, []);

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            DynaPredict
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          {!error && !health && <CircularProgress />}

          {health && (
            <Stack direction="row" spacing={1}>
              <StatusChip label="API" value={health.api} />
              <StatusChip label="Banco" value={health.database} />
            </Stack>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}

export default App;