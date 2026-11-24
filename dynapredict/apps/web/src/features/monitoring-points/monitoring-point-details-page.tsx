import { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  LinearProgress,
  Link,
  Paper,
  Snackbar,
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
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { formatDateTime } from '../../lib/format';
import {
  fetchPointTimeSeries,
  type TimeSeriesSummary,
} from '../time-series/time-series.slice';
import { UploadTimeSeriesDialog } from '../time-series/upload-time-series-dialog';

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
                {/* Abre a página da série, com o gráfico e as métricas */}
                <Link component={RouterLink} to={`/time-series/${item.id}`}>
                  {item.name}
                </Link>
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

  // O diálogo de enviar série está aberto?
  const [uploadOpen, setUploadOpen] = useState(false);
  // Mensagem de sucesso que aparece no rodapé (null = nenhuma)
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const request = dispatch(fetchPointTimeSeries(pointId));
    // Saiu da página antes da resposta? Cancela a busca
    return () => request.abort();
  }, [dispatch, pointId]);

  // Só mostra o ponto da URL: enquanto o novo carrega, a store ainda tem
  // o ponto (e as séries) da página visitada antes
  const current = point?.id === pointId ? point : null;

  function handleUploaded(message: string) {
    setUploadOpen(false);
    setNotice(message);
    // Busca de novo: a série nova entra na lista, na ordem certa
    dispatch(fetchPointTimeSeries(pointId));
  }

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

          <Stack
            direction="row"
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Typography variant="h6">Séries temporais</Typography>
            {/* Os dados vêm do sensor: sem sensor, não há o que enviar */}
            <Button
              variant="contained"
              startIcon={<UploadFileIcon />}
              disabled={!current.sensor}
              onClick={() => setUploadOpen(true)}
            >
              Enviar série
            </Button>
          </Stack>

          {!current.sensor && (
            <Typography color="text.secondary">
              Coloque um sensor no ponto para enviar dados.
            </Typography>
          )}

          {items.length > 0 ? (
            <SeriesTable series={items} />
          ) : (
            <Typography color="text.secondary">
              Nenhuma série enviada para este ponto ainda.
            </Typography>
          )}
        </>
      )}

      {uploadOpen && (
        <UploadTimeSeriesDialog
          pointId={pointId}
          onClose={() => setUploadOpen(false)}
          onUploaded={handleUploaded}
        />
      )}

      <Snackbar
        open={notice !== null}
        autoHideDuration={4000}
        onClose={() => setNotice(null)}
        message={notice}
      />
    </Stack>
  );
}
