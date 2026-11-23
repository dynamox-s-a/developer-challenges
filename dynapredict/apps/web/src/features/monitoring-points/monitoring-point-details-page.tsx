import { useEffect } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchPointTimeSeries,
  type TimeSeriesSummary,
} from '../time-series/time-series.slice';

// Data e hora no fuso de quem está usando, ex.: 22/11/2026, 07:00:00
function formatDateTime(isoDate: string) {
  return new Date(isoDate).toLocaleString('pt-BR');
}

function SeriesTable({ series }: { series: TimeSeriesSummary[] }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Série</TableCell>
            <TableCell align="right">Medições</TableCell>
            <TableCell>Início</TableCell>
            <TableCell>Fim</TableCell>
            <TableCell>Sensor</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {series.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                {item.name}
                {item.unit && ` (${item.unit})`}
              </TableCell>
              <TableCell align="right">
                {item.sampleCount.toLocaleString('pt-BR')}
              </TableCell>
              <TableCell>{formatDateTime(item.startedAt)}</TableCell>
              <TableCell>{formatDateTime(item.endedAt)}</TableCell>
              <TableCell>{item.sensorSerialNumber}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function MonitoringPointDetailsPage() {
  // O id vem da URL (/monitoring-points/:id). A rota sempre tem um id;
  // o '' só existe porque o TypeScript não sabe disso
  const { id: pointId = '' } = useParams();
  const dispatch = useAppDispatch();
  const { point, items, status, error } = useAppSelector(
    (state) => state.timeSeries,
  );

  useEffect(() => {
    const request = dispatch(fetchPointTimeSeries(pointId));
    // Saiu da página antes da resposta? Cancela a busca
    return () => request.abort();
  }, [dispatch, pointId]);

  // Só mostra o ponto da URL: enquanto o novo carrega, a store ainda tem
  // o ponto (e as séries) da página visitada antes
  const current = point?.id === pointId ? point : null;

  return (
    <Stack spacing={2}>
      <Box>
        <Button
          component={RouterLink}
          to="/monitoring-points"
          startIcon={<ArrowBackIcon />}
        >
          Pontos de monitoramento
        </Button>
      </Box>

      {status === 'loading' && (
        <LinearProgress aria-label="Carregando o ponto" />
      )}

      {status === 'failed' && (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              onClick={() => dispatch(fetchPointTimeSeries(pointId))}
            >
              Tentar de novo
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {current && (
        <>
          <Box>
            <Typography variant="h4">{current.name}</Typography>
            <Typography color="text.secondary">
              Máquina: {current.machine.name} ({current.machine.type})
            </Typography>
            <Typography color="text.secondary">
              Sensor:{' '}
              {current.sensor
                ? `${current.sensor.model} · ${current.sensor.serialNumber}`
                : 'sem sensor'}
            </Typography>
          </Box>

          <Typography variant="h6">Séries temporais</Typography>

          {items.length > 0 ? (
            <SeriesTable series={items} />
          ) : (
            <Typography color="text.secondary">
              Nenhuma série enviada para este ponto ainda.
            </Typography>
          )}
        </>
      )}
    </Stack>
  );
}
