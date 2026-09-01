import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, useParams } from 'react-router-dom';

import { machineTag } from '@dynamox/domain';
import { ErrorState, LoadingState } from '@dynamox/ui';

import { api } from '../../api/client';
import { InvestigationBreadcrumbs } from '../../components/investigation/InvestigationBreadcrumbs';
import { KpiStrip } from '../../components/investigation/KpiStrip';
import {
  formatMeasurement,
  formatNumber,
  seriesMetricLabel,
} from '../../features/dashboard/dashboardFormatters';
import {
  formatDateTime,
} from '../../features/time/instant';
import { links } from '../../features/investigation/links';
import { useAnalyticsQuery, useTimeRange } from '../../features/investigation/useAnalyticsQuery';

/**
 * NÍVEL "AQUISIÇÃO": o último nível antes do dado bruto.
 *
 * O universo aqui já é pequeno (uma aquisição = 60 janelas × 5 séries), então estatística
 * detalhada por série é barata. A amostra crua continua atrás de um clique explícito.
 */
export function AcquisitionPage(): JSX.Element {
  const { cycleId = '' } = useParams();
  const range = useTimeRange();
  const query = useAnalyticsQuery(() => api.acquisition(cycleId), [cycleId]);
  const data = query.data;

  return (
    <Box sx={{ pt: 2, pb: 3 }}>
      <InvestigationBreadcrumbs
        steps={[
          { label: 'Visão geral', to: '/' },
          ...(data?.machineName
            ? [{ label: machineTag(data.machineName), to: links.machine(data.machineName, range) }]
            : []),
          ...(data?.machineName && data.monitoringPointName
            ? [
                {
                  label: data.monitoringPointName,
                  to: links.point(data.machineName, data.monitoringPointName, range),
                },
              ]
            : []),
          ...(data?.sensorSerialNumber
            ? [{ label: data.sensorSerialNumber, to: links.sensor(data.sensorSerialNumber, range) }]
            : []),
          { label: data?.startedAt ? formatDateTime(data.startedAt) : 'Aquisição' },
        ]}
      />

      {query.status === 'loading' || query.status === 'idle' ? (
        <LoadingState label="Carregando aquisição…" />
      ) : null}
      {query.status === 'failed' ? (
        <ErrorState message={query.error ?? 'Não foi possível abrir a aquisição.'} onRetry={query.reload} />
      ) : null}

      {query.status === 'succeeded' && data ? (
        <>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" gap={1.5}>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h1" component="h1">
                Aquisição · {data.startedAt ? formatDateTime(data.startedAt) : '—'}
              </Typography>
              <Typography variant="caption" color="text.secondary" component="div" sx={{ mt: 0.25 }}>
                {data.sensorSerialNumber} · {data.machineName ?? '—'} · {data.monitoringPointName ?? '—'}
              </Typography>
              <Stack direction="row" gap={0.75} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                <Chip size="small" variant="outlined" label={`Origem: ${data.origin}`} />
                {data.scenario ? <Chip size="small" variant="outlined" label={`Cenário: ${data.scenario}`} /> : null}
                {data.tags.map((tag) => (
                  <Chip key={tag} size="small" variant="outlined" label={tag} />
                ))}
              </Stack>
            </Box>

            <Button
              component={RouterLink}
              to={links.samples(cycleId, range)}
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              sx={{ alignSelf: { md: 'flex-start' }, flexShrink: 0 }}
            >
              Ver dados brutos
            </Button>
          </Stack>

          <Box sx={{ mt: 2 }}>
            <KpiStrip
              items={[
                { label: 'Duração', value: data.durationSeconds ? `${data.durationSeconds} s` : '—' },
                { label: 'Amostras', value: formatNumber(data.sampleCount, 0) },
                { label: 'Medições', value: String(data.measurementCount) },
                { label: 'RPM', value: data.rpm === null ? '—' : formatNumber(data.rpm, 1) },
                { label: 'Carga', value: data.loadPercent === null ? '—' : `${formatNumber(data.loadPercent, 1)}%` },
                { label: 'Ingerida em', value: formatDateTime(data.ingestedAt) },
              ]}
            />
          </Box>

          <Card variant="outlined" sx={{ mt: 2 }}>
            <Box sx={(theme) => ({ px: `${theme.dashboard.cardPadding}px`, pt: 1.5, pb: 0.5 })}>
              <Typography variant="h2" component="h2">
                Resumo por série
              </Typography>
              <Typography variant="caption" color="text.secondary" component="div">
                Estatística calculada no banco sobre as 60 janelas desta aquisição.
              </Typography>
            </Box>
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table size="small" aria-label="Séries da aquisição">
                <TableHead>
                  <TableRow>
                    <TableCell>Série</TableCell>
                    <TableCell align="right">Amostras</TableCell>
                    <TableCell align="right">Mín</TableCell>
                    <TableCell align="right">Máx</TableCell>
                    <TableCell align="right">Média</TableCell>
                    <TableCell align="right">RMS</TableCell>
                    <TableCell>Intervalo</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.series.map((item) => (
                    <TableRow key={item.seriesId} hover>
                      <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                        {seriesMetricLabel(item.physicalQuantity, item.axis)}
                      </TableCell>
                      <TableCell align="right">{item.sampleCount}</TableCell>
                      <TableCell align="right">{item.min === null ? '—' : formatMeasurement(item.min, item.unit)}</TableCell>
                      <TableCell align="right">{item.max === null ? '—' : formatMeasurement(item.max, item.unit)}</TableCell>
                      <TableCell align="right">{item.avg === null ? '—' : formatMeasurement(item.avg, item.unit)}</TableCell>
                      <TableCell align="right">{item.rms === null ? '—' : formatMeasurement(item.rms, item.unit)}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap', color: 'text.secondary' }}>
                        {item.startedAt ? formatDateTime(item.startedAt) : '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

          {data.groundTruth ? (
            <Card variant="outlined" sx={{ mt: 2 }}>
              <Box sx={(theme) => ({ p: `${theme.dashboard.cardPadding}px` })}>
                <Typography variant="h2" component="h2">
                  Verdade-terreno declarada
                </Typography>
                <Typography variant="caption" color="text.secondary" component="div" sx={{ mb: 1 }}>
                  Registrada pelo gerador sintético no momento da ingestão. É lida apenas pela validação
                  (<code>npm run alerts:validate</code>), que mede o motor contra ela — o motor de alertas
                  nunca a consulta.
                </Typography>
                <Stack direction="row" gap={0.75} flexWrap="wrap" useFlexGap>
                  {Object.entries(data.groundTruth)
                    .filter(([, value]) => typeof value !== 'object')
                    .map(([key, value]) => (
                      <Chip key={key} size="small" variant="outlined" label={`${key}: ${String(value)}`} />
                    ))}
                </Stack>
              </Box>
            </Card>
          ) : null}
        </>
      ) : null}
    </Box>
  );
}
