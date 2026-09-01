import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import type { AlertListResponseDto } from '@dynamox/domain';
import { EmptyState } from '@dynamox/ui';

import type { DashboardView } from '../../features/dashboard/dashboardAggregations';
import { formatNumber } from '../../features/dashboard/dashboardFormatters';
import { DashboardCard } from './DashboardCard';
import { chartTooltipStyles } from './chartTheme';

interface Slice {
  key: string;
  label: string;
  value: number;
  color: string;
}

/**
 * Uma rosca com rótulo central e a própria legenda embaixo — a unidade visual do painel.
 * Duas delas lado a lado dividem o card em colunas iguais, cada uma com seu total.
 */
function Donut({
  slices,
  centerLabel,
  unit,
  tooltip,
}: {
  slices: Slice[];
  centerLabel: string;
  unit: string;
  tooltip: ReturnType<typeof chartTooltipStyles>;
}): JSX.Element {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  return (
    <Stack spacing={1} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
      <Box
        sx={{ position: 'relative', width: '100%', maxWidth: 132, aspectRatio: '1 / 1' }}
        role="img"
        aria-label={`${centerLabel}: ${slices.map((slice) => `${slice.label}: ${slice.value}`).join('; ')}`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={slices}
              dataKey="value"
              nameKey="label"
              innerRadius="68%"
              outerRadius="96%"
              paddingAngle={slices.length > 1 ? 2 : 0}
              strokeWidth={0}
              isAnimationActive={false}
            >
              {slices.map((slice) => (
                <Cell key={slice.key} fill={slice.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [
                `${value} ${unit} · ${formatNumber((value / total) * 100, 1)}%`,
                name,
              ]}
              {...tooltip}
            />
          </PieChart>
        </ResponsiveContainer>
        <Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', pointerEvents: 'none' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontSize: '1.3rem', fontWeight: 750, lineHeight: 1.05 }}>{total}</Typography>
            <Typography variant="caption" color="text.secondary">
              {centerLabel}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Stack spacing={0.5} sx={{ width: '100%', minWidth: 0 }}>
        {slices.map((slice) => (
          <Stack key={slice.key} direction="row" alignItems="center" spacing={0.75}>
            <Box aria-hidden="true" sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: slice.color, flexShrink: 0 }} />
            <Typography variant="caption" sx={{ flexGrow: 1 }} noWrap>
              {slice.label}
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700 }}>
              {slice.value}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ width: 40, textAlign: 'right' }}>
              {formatNumber((slice.value / total) * 100, 0)}%
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}

/**
 * Saúde da INSTRUMENTAÇÃO, em duas roscas irmãs: à esquerda a recência das leituras (o dado
 * está chegando?), à direita os episódios de alerta por status (o que o motor abriu com
 * esse dado). São as duas metades da mesma pergunta — "posso confiar no que estou vendo, e
 * o que ele me disse?" — e nenhuma fala de condição: Normal/Atenção vivem nos painéis de
 * condição. Uma rosca única de recência quase sempre mostrava um círculo verde de uma fatia
 * só, com metade do card vazio.
 */
export function SensorHealthDonut({
  view,
  loading,
  alerts = null,
}: {
  view: DashboardView;
  loading: boolean;
  /** Resumo persistido (`/alerts`): a segunda rosca usa `counts` do universo. */
  alerts?: AlertListResponseDto | null;
}): JSX.Element {
  const muiTheme = useTheme();
  const noSensor = view.cells.filter((cell) => cell.condition === 'no-sensor').length;

  const recency: Slice[] = [
    {
      key: 'current',
      label: 'Atualizados',
      value: view.distribution.find((item) => item.key === 'current')?.value ?? 0,
      color: muiTheme.palette.condition.normal,
    },
    {
      key: 'stale',
      label: 'Desatualizados',
      value: view.distribution.find((item) => item.key === 'stale')?.value ?? 0,
      color: muiTheme.palette.condition.stale,
    },
    {
      key: 'future',
      label: 'Relógio divergente',
      value: view.distribution.find((item) => item.key === 'future')?.value ?? 0,
      color: muiTheme.palette.condition.attention,
    },
    {
      key: 'no-data',
      label: 'Sem dados',
      value: view.distribution.find((item) => item.key === 'no-data')?.value ?? 0,
      color: muiTheme.palette.condition.noData,
    },
    {
      key: 'no-sensor',
      label: 'Não instalado',
      value: noSensor,
      color: muiTheme.palette.condition.unclassified,
    },
  ].filter((slice) => slice.value > 0);

  const counts = alerts?.counts ?? null;
  const episodes: Slice[] = counts
    ? [
        { key: 'open', label: 'Abertos', value: counts.open, color: muiTheme.palette.alert.a2 },
        { key: 'acknowledged', label: 'Reconhecidos', value: counts.acknowledged, color: muiTheme.palette.alert.acknowledged },
        { key: 'resolved', label: 'Resolvidos', value: counts.resolved, color: muiTheme.palette.alert.resolved },
      ].filter((slice) => slice.value > 0)
    : [];

  const total = recency.reduce((sum, slice) => sum + slice.value, 0);
  const tooltip = chartTooltipStyles(muiTheme);

  return (
    <DashboardCard
      title="Saúde dos sensores"
      titleId="sensor-health-title"
      subtitle="Recência das leituras e episódios de alerta — não é condição."
      info="Atualizado = leitura nas últimas 24 h. Os episódios vêm do motor de alertas (/alerts), por status derivado: aberto, reconhecido, resolvido. Condição (Normal/Atenção) vive nos painéis de condição."
    >
      {loading ? (
        <Stack direction="row" spacing={2} justifyContent="center">
          <Skeleton variant="circular" width={120} height={120} />
          <Skeleton variant="circular" width={120} height={120} />
        </Stack>
      ) : null}

      {!loading && total === 0 ? (
        <EmptyState
          title="Nenhum sensor"
          description="Associe sensores aos pontos para acompanhar a disponibilidade."
        />
      ) : null}

      {!loading && total > 0 ? (
        <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ flexGrow: 1, minWidth: 0, pt: 0.5 }}>
          <Donut slices={recency} centerLabel="sensores" unit="sensor(es)" tooltip={tooltip} />
          {episodes.length > 0 ? (
            <Donut slices={episodes} centerLabel="episódios" unit="episódio(s)" tooltip={tooltip} />
          ) : (
            <Stack spacing={0.75} alignItems="center" justifyContent="center" sx={{ flex: 1, minWidth: 0, alignSelf: 'stretch' }}>
              <Typography variant="caption" color="text.secondary" align="center">
                Nenhum episódio de alerta registrado.
              </Typography>
            </Stack>
          )}
        </Stack>
      ) : null}
    </DashboardCard>
  );
}
