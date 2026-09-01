import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import type { DashboardView } from '../../features/dashboard/dashboardAggregations';
import { formatNumber } from '../../features/dashboard/dashboardFormatters';
import { DashboardCard } from './DashboardCard';

/**
 * Qualidade dos dados — responde "posso confiar na visão atual?". Linhas densas com
 * barras de progresso; cada linha é um conceito de QUALIDADE/RECÊNCIA/COBERTURA,
 * nunca de condição.
 */
export function DataQualityPanel({
  view,
  loading,
}: {
  view: DashboardView;
  loading: boolean;
}): JSX.Element {
  const muiTheme = useTheme();
  const installed = view.cells.filter((cell) => cell.sensorSerial).length;
  const points = view.cells.length;

  const find = (key: string) => view.distribution.find((item) => item.key === key)?.value ?? 0;
  const rows = [
    {
      key: 'current',
      label: 'Atualizados',
      value: find('current'),
      total: installed,
      color: muiTheme.palette.condition.normal,
    },
    {
      key: 'no-data',
      label: 'Sem dados',
      value: find('no-data'),
      total: installed,
      color: muiTheme.palette.condition.noData,
    },
    {
      key: 'future',
      label: 'Relógio divergente',
      value: find('future'),
      total: installed,
      color: muiTheme.palette.condition.attention,
    },
    {
      key: 'stale',
      label: 'Desatualizados',
      value: find('stale'),
      total: installed,
      color: muiTheme.palette.condition.stale,
    },
    {
      key: 'coverage',
      label: 'Cobertura (instrumentados)',
      value: installed,
      total: points,
      color: muiTheme.palette.primary.main,
    },
  ].filter((row) => row.key !== 'stale' || row.value > 0);

  return (
    <DashboardCard
      title="Qualidade dos dados"
      titleId="data-quality-title"
      subtitle="Recência, presença e cobertura das leituras."
      info="Responde se a visão atual é confiável: sensores atualizados, lacunas, relógios divergentes e cobertura de instrumentação."
    >
      {loading ? <Skeleton variant="rounded" height={170} /> : null}
      {!loading ? (
        <Stack spacing={0.6}>
          {rows.map((row) => {
            const share = row.total > 0 ? row.value / row.total : 0;
            return (
              <Box key={row.key}>
                <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {row.label}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="baseline">
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>
                      {row.total > 0 ? `${formatNumber(share * 100, 1)}%` : '—'}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ width: 56, textAlign: 'right' }}
                    >
                      {row.value} / {row.total}
                    </Typography>
                  </Stack>
                </Stack>
                <Box
                  role="progressbar"
                  aria-label={row.label}
                  aria-valuenow={Math.round(share * 100)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  sx={{
                    mt: 0.25,
                    height: 5,
                    borderRadius: 999,
                    bgcolor: 'action.hover',
                    overflow: 'hidden',
                  }}
                >
                  <Box sx={{ width: `${share * 100}%`, height: '100%', bgcolor: row.color }} />
                </Box>
              </Box>
            );
          })}
        </Stack>
      ) : null}
    </DashboardCard>
  );
}
