import { useEffect } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { formatDateTime, formatNumber } from '../../lib/format';
import {
  fetchTimeSeriesDetails,
  type TimeSeriesMetrics,
} from './time-series-details.slice';
import { TimeSeriesChart } from './time-series-chart';

// Os cartões de métricas, na ordem em que aparecem
const METRICS: { key: keyof TimeSeriesMetrics; label: string }[] = [
  { key: 'count', label: 'Medições' },
  { key: 'min', label: 'Mínimo' },
  { key: 'max', label: 'Máximo' },
  { key: 'mean', label: 'Média' },
  { key: 'stdDev', label: 'Desvio-padrão' },
  { key: 'rms', label: 'RMS' },
];

type MetricsGridProps = { metrics: TimeSeriesMetrics; unit: string | null };

function MetricsGrid({ metrics, unit }: MetricsGridProps) {
  return (
    // 2 colunas no celular, 3 no tablet e 6 (uma linha só) em telas grandes
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: {
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(3, 1fr)',
          lg: 'repeat(6, 1fr)',
        },
      }}
    >
      {METRICS.map(({ key, label }) => (
        <Paper key={key} role="group" aria-label={label} sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h6">
            {formatNumber(metrics[key])}
            {/* A quantidade de medições não tem unidade */}
            {key !== 'count' && unit && ` ${unit}`}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}

export function TimeSeriesPage() {
  // O id vem da URL (/time-series/:id). Como na página do ponto, o '' só
  // existe porque o TypeScript não sabe que a rota sempre tem um id
  const { id: seriesId = '' } = useParams();
  const dispatch = useAppDispatch();
  const { series, metrics, status, error } = useAppSelector(
    (state) => state.timeSeriesDetails,
  );

  useEffect(() => {
    const request = dispatch(fetchTimeSeriesDetails(seriesId));
    // Saiu da página antes da resposta? Cancela a busca
    return () => request.abort();
  }, [dispatch, seriesId]);

  // Só mostra a série da URL: enquanto a nova carrega, a store ainda tem a
  // série da página visitada antes
  const current = series?.id === seriesId ? series : null;

  return (
    <Stack spacing={2}>
      <Box>
        {/* Volta ao ponto da série. Antes de a série chegar, à lista */}
        <Button
          component={RouterLink}
          to={
            current
              ? `/monitoring-points/${current.monitoringPointId}`
              : '/monitoring-points'
          }
          startIcon={<ArrowBackIcon />}
        >
          {current ? 'Voltar ao ponto' : 'Pontos de monitoramento'}
        </Button>
      </Box>

      {status === 'loading' && (
        <LinearProgress aria-label="Carregando a série" />
      )}

      {status === 'failed' && (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              onClick={() => dispatch(fetchTimeSeriesDetails(seriesId))}
            >
              Tentar de novo
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {current && metrics && (
        <>
          <Box>
            <Typography variant="h4">
              {current.name}
              {current.unit && ` (${current.unit})`}
            </Typography>
            <Typography color="text.secondary">
              De {formatDateTime(current.startedAt)} a{' '}
              {formatDateTime(current.endedAt)} · Sensor{' '}
              {current.sensorSerialNumber}
            </Typography>
          </Box>

          <MetricsGrid metrics={metrics} unit={current.unit} />

          {/* "figure" com nome: leitores de tela (e os testes) acham o
              gráfico pelo nome da série */}
          <Paper
            component="figure"
            aria-label={`Gráfico de ${current.name}`}
            sx={{ p: 2, m: 0 }}
          >
            <TimeSeriesChart
              samples={current.samples}
              unit={current.unit}
              mean={metrics.mean}
            />
          </Paper>
        </>
      )}
    </Stack>
  );
}
