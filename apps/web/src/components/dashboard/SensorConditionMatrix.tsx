import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SensorsOffOutlinedIcon from '@mui/icons-material/SensorsOffOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { alpha, type Theme } from '@mui/material/styles';
import type { ReactElement } from 'react';

import { EmptyState } from '@dynamox/ui';

import type {
  ConditionKind,
  DashboardView,
  SensorCellView,
} from '../../features/dashboard/dashboardAggregations';
import {
  formatMeasurement,
  formatNumber,
} from '../../features/dashboard/dashboardFormatters';
import {
  formatDateTime,
  formatRelativeTime,
} from '../../features/time/instant';

const CONDITION_META: Record<
  ConditionKind,
  { label: string; color: 'success' | 'warning' | 'error' | 'default'; icon: ReactElement }
> = {
  normal: { label: 'Normal demonstrativo', color: 'success', icon: <CheckCircleOutlineIcon /> },
  observation: { label: 'Observação demonstrativa', color: 'warning', icon: <ErrorOutlineIcon /> },
  attention: { label: 'Atenção demonstrativa', color: 'error', icon: <WarningAmberOutlinedIcon /> },
  unclassified: { label: 'Sem classificação', color: 'default', icon: <HelpOutlineIcon /> },
  'no-data': { label: 'Sem dados', color: 'default', icon: <SensorsOffOutlinedIcon /> },
  'no-sensor': { label: 'Sem sensor', color: 'default', icon: <SensorsOffOutlinedIcon /> },
};

const LEGEND_CONDITIONS: ConditionKind[] = [
  'normal',
  'observation',
  'attention',
  'unclassified',
  'no-data',
];

function cellBackground(theme: Theme, condition: ConditionKind): string {
  if (condition === 'attention') return alpha(theme.palette.error.main, 0.08);
  if (condition === 'observation') return alpha(theme.palette.warning.main, 0.1);
  if (condition === 'normal') return alpha(theme.palette.success.main, 0.07);
  return theme.palette.background.paper;
}

function CellTooltip({ cell }: { cell: SensorCellView }): JSX.Element {
  return (
    <Box sx={{ p: 0.5, maxWidth: 330 }}>
      <Typography variant="subtitle2">{cell.machineName} · {cell.pointName}</Typography>
      <Typography variant="caption" display="block">
        Sensor: {cell.sensorSerial ?? 'não instalado'} · {cell.sensorModel ?? 'sem modelo'}
      </Typography>
      <Typography variant="caption" display="block">
        {cell.evidence?.label ?? 'Última leitura'}:{' '}
        {formatMeasurement(cell.evidence?.value ?? null, cell.evidence?.unit ?? null)}
      </Typography>
      <Typography variant="caption" display="block">
        Timestamp: {formatDateTime(cell.lastTimestamp)} · {cell.freshnessLabel}
      </Typography>
      <Typography variant="caption" display="block">
        Condição: {cell.conditionLabel}
      </Typography>
      {cell.assessment ? (
        <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
          Índice demonstrativo: {formatNumber(cell.assessment.deviationRatio, 2)}× · baseline radial{' '}
          {formatNumber(cell.assessment.baseline)} {cell.lastUnit ?? 'g'}
        </Typography>
      ) : (
        <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
          Desvio ao baseline: não calculável com os dados disponíveis.
        </Typography>
      )}
    </Box>
  );
}

export interface SensorConditionMatrixProps {
  view: DashboardView;
  loading: boolean;
  nowMs: number;
  selectedSeriesId: string | null;
  onSelectSeries: (seriesId: string) => void;
}

export function SensorConditionMatrix({
  view,
  loading,
  nowMs,
  selectedSeriesId,
  onSelectSeries,
}: SensorConditionMatrixProps): JSX.Element {
  return (
    <Card variant="outlined" component="section" aria-labelledby="condition-matrix-title">
      <CardContent sx={{ p: { xs: 1.5, md: 2 }, '&:last-child': { pb: { xs: 1.5, md: 2 } } }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', md: 'flex-start' }}
          gap={1.5}
        >
          <Box>
            <Typography id="condition-matrix-title" variant="h2" component="h2">
              Frota — condição por ponto
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
              Visão completa da planta. Selecione um ponto para investigar o histórico.
            </Typography>
          </Box>
          <Stack direction="row" gap={0.75} flexWrap="wrap" useFlexGap aria-label="Legenda de condição">
            {LEGEND_CONDITIONS.map(
              (condition) => {
                const meta = CONDITION_META[condition];
                return (
                  <Chip
                    key={condition}
                    icon={meta.icon}
                    label={meta.label}
                    color={meta.color}
                    size="small"
                    variant="outlined"
                  />
                );
              },
            )}
            <Chip
              icon={<AccessTimeOutlinedIcon />}
              label="Desatualizado"
              color="warning"
              size="small"
              variant="outlined"
            />
          </Stack>
        </Stack>

        {loading ? (
          <Stack spacing={1.25} sx={{ mt: 2 }} aria-label="Carregando matriz de sensores">
            {[0, 1, 2].map((key) => (
              <Skeleton key={key} variant="rounded" height={92} />
            ))}
          </Stack>
        ) : null}

        {!loading && view.rows.length === 0 ? (
          <EmptyState
            title="Nenhuma máquina cadastrada"
            description="Cadastre uma máquina e seus pontos para iniciar o monitoramento operacional."
          />
        ) : null}

        {!loading && view.rows.length > 0 ? (
          <Stack role="grid" aria-label="Máquinas, pontos, sensores e condição" spacing={1.25} sx={{ mt: 2 }}>
            {view.rows.map((row) => (
              <Box
                key={row.machine.id}
                role="row"
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'minmax(170px, 0.65fr) minmax(0, 3fr)' },
                  gap: 1,
                  p: 1,
                  borderRadius: 2.5,
                  bgcolor: 'background.default',
                }}
              >
                <Box role="rowheader" sx={{ p: 1, minWidth: 0 }}>
                  <Typography variant="subtitle2" noWrap title={row.machine.name}>
                    {row.machine.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {row.machine.type} · {row.cells.length} ponto(s)
                  </Typography>
                </Box>

                {row.cells.length === 0 ? (
                  <Box sx={{ p: 1.5, border: '1px dashed', borderColor: 'divider', borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Máquina sem pontos de monitoramento.
                    </Typography>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 205px), 1fr))',
                      gap: 1,
                      minWidth: 0,
                    }}
                  >
                    {row.cells.map((cell) => {
                      const meta = CONDITION_META[cell.condition];
                      const selected = cell.series.some((item) => item.id === selectedSeriesId);
                      const clickable = Boolean(cell.preferredSeriesId);
                      return (
                        <Tooltip key={cell.key} title={<CellTooltip cell={cell} />} arrow>
                          <span role="gridcell">
                            <ButtonBase
                              disabled={!clickable}
                              aria-label={`${cell.machineName}, ${cell.pointName}, ${cell.sensorSerial ?? 'sem sensor'}, ${cell.conditionLabel}`}
                              aria-pressed={selected}
                              onClick={() => {
                                if (cell.preferredSeriesId) onSelectSeries(cell.preferredSeriesId);
                              }}
                              sx={(theme) => ({
                                width: '100%',
                                minHeight: 148,
                                p: 1.25,
                                display: 'block',
                                textAlign: 'left',
                                borderRadius: 2,
                                border: 1,
                                borderColor: selected ? 'primary.main' : 'divider',
                                bgcolor: cellBackground(theme, cell.condition),
                                boxShadow: selected ? `0 0 0 2px ${alpha(theme.palette.primary.main, 0.18)}` : 'none',
                                '&:focus-visible': {
                                  outline: `3px solid ${alpha(theme.palette.primary.main, 0.35)}`,
                                  outlineOffset: 2,
                                },
                                '&.Mui-disabled': { opacity: 1 },
                              })}
                            >
                              <Stack direction="row" justifyContent="space-between" gap={1}>
                                <Box sx={{ minWidth: 0 }}>
                                  <Typography variant="caption" color="text.secondary">
                                    {cell.positionLabel} · {cell.pointName}
                                  </Typography>
                                  <Typography variant="subtitle2" noWrap>
                                    {cell.sensorSerial ?? 'Sensor não instalado'}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {cell.sensorModel ?? 'Ponto aguardando sensor'}
                                  </Typography>
                                </Box>
                                {cell.freshness !== 'current' && cell.freshness !== 'unknown' ? (
                                  <Tooltip title={cell.freshnessLabel}>
                                    <AccessTimeOutlinedIcon
                                      color={cell.freshness === 'stale' ? 'warning' : 'error'}
                                      fontSize="small"
                                      aria-label={cell.freshnessLabel}
                                    />
                                  </Tooltip>
                                ) : null}
                              </Stack>
                              <Stack direction="row" gap={0.75} alignItems="center" sx={{ mt: 1 }} flexWrap="wrap">
                                <Chip
                                  icon={meta.icon}
                                  label={meta.label}
                                  color={meta.color}
                                  size="small"
                                  variant="outlined"
                                />
                                {cell.evidence?.deviationRatio !== null &&
                                cell.evidence?.deviationRatio !== undefined ? (
                                  <Typography
                                    variant="caption"
                                    sx={{ fontWeight: 700 }}
                                    color={
                                      cell.condition === 'attention'
                                        ? 'error.main'
                                        : cell.condition === 'observation'
                                          ? 'warning.main'
                                          : 'text.secondary'
                                    }
                                  >
                                    {formatNumber(cell.evidence.deviationRatio, 2)}× baseline
                                  </Typography>
                                ) : null}
                              </Stack>
                              {/* A medição que sustenta o estado: grandeza, eixo, valor e
                                  unidade. Sem isto, o número da célula podia ser de outra
                                  série que não a que classificou o ponto. */}
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ display: 'block', mt: 0.75 }}
                              >
                                {cell.evidence
                                  ? `${cell.evidence.label} · ${formatMeasurement(cell.evidence.value, cell.evidence.unit)}`
                                  : 'Sem leitura'}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ display: 'block' }}
                              >
                                {cell.lastTimestamp
                                  ? `Leitura ${formatRelativeTime(cell.lastTimestamp, nowMs)}`
                                  : 'Nunca reportou'}
                              </Typography>
                            </ButtonBase>
                          </span>
                        </Tooltip>
                      );
                    })}
                  </Box>
                )}
              </Box>
            ))}
          </Stack>
        ) : null}
      </CardContent>
    </Card>
  );
}
