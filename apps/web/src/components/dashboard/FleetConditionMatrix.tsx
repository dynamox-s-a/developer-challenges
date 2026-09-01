import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import { DEFAULT_CONDITION_POLICY, machineTag } from '@dynamox/domain';
import { EmptyState } from '@dynamox/ui';

import type {
  DashboardView,
  SensorCellView,
} from '../../features/dashboard/dashboardAggregations';
import { formatNumber } from '../../features/dashboard/dashboardFormatters';
import { formatRelativeTime } from '../../features/time/instant';
import { links, type AnalyticsRange } from '../../features/investigation/links';
import { DashboardCard } from './DashboardCard';
import { COLOR_CEILING, severityColor } from './ActivityHeatmap';

/**
 * Conteúdo do tooltip da célula: identidade, condição e a evidência que a sustenta.
 *
 * Três linhas, não dez. Um tooltip que precisa ser lido devagar não serve a uma matriz
 * que existe justamente para ser varrida de relance — o detalhe completo está a um clique,
 * na página do ponto.
 */
function CellTooltip({ cell, nowMs }: { cell: SensorCellView; nowMs: number }): JSX.Element {
  return (
    <Box sx={{ p: 0.25, maxWidth: 280 }}>
      <Typography variant="subtitle2">
        {machineTag(cell.machineName)} · {cell.pointName}
      </Typography>
      <Typography variant="caption" display="block">
        {cell.conditionLabel}
        {cell.assessment?.deviationRatio != null
          ? ` · ${formatNumber(cell.assessment.deviationRatio, 2)}× (RMS radial Y/Z)`
          : ''}
        {cell.sensorSerial ? ` · ${cell.sensorSerial}` : ' · sem sensor'}
      </Typography>
      <Typography variant="caption" display="block" sx={{ opacity: 0.85 }}>
        Última leitura {formatRelativeTime(cell.lastTimestamp, nowMs)} · abre o ponto
      </Typography>
    </Box>
  );
}

/**
 * Matriz de condição da frota — a leitura de uma olhada: máquinas nas colunas, posições
 * nas linhas, um ponto colorido por sensor. Cabe numa coluna estreita porque a identidade
 * do sensor vive no tooltip e no rótulo acessível, não numa etiqueta por célula.
 * Clique seleciona o contexto da tendência crítica.
 */
export function FleetConditionMatrix({
  view,
  loading,
  nowMs,
  selectedSeriesId,
  range,
}: {
  view: DashboardView;
  loading: boolean;
  nowMs: number;
  selectedSeriesId: string | null;
  range: AnalyticsRange;
}): JSX.Element {
  const muiTheme = useTheme();
  const navigate = useNavigate();
  const machines = view.rows;
  const positions = [...new Set(view.cells.map((cell) => cell.positionLabel))];
  // A legenda nomeia as FAIXAS da política — a mesma régua do mapa de severidade.
  const legend = [
    { label: 'sem referência', ratio: null },
    { label: '1×', ratio: 1 },
    { label: `${formatNumber(DEFAULT_CONDITION_POLICY.observationRatio, 1)}× observação`, ratio: DEFAULT_CONDITION_POLICY.observationRatio },
    { label: `${formatNumber(DEFAULT_CONDITION_POLICY.attentionRatio, 1)}× atenção`, ratio: DEFAULT_CONDITION_POLICY.attentionRatio },
    { label: `${formatNumber(COLOR_CEILING, 1)}×+`, ratio: COLOR_CEILING },
  ];

  return (
    <DashboardCard
      title="Matriz de condição da frota"
      titleId="fleet-matrix-title"
      subtitle="Desvio de cada ponto contra a baseline da condição, nas faixas da política."
      info="Cada célula é um ponto monitorado: o número é o desvio atual contra a baseline da condição, e a cor é a faixa da política — a mesma régua do mapa de severidade. Ponto sem referência comparável na janela fica neutro. Clique para abrir o ponto."
      flush
    >
      {loading ? (
        <Box sx={{ px: 2 }} aria-label="Carregando matriz de sensores">
          <Skeleton variant="rounded" height={140} />
        </Box>
      ) : null}

      {!loading && machines.length === 0 ? (
        <Box sx={{ px: 2 }}>
          <EmptyState
            title="Nenhuma máquina cadastrada"
            description="Cadastre uma máquina e seus pontos para iniciar o monitoramento operacional."
          />
        </Box>
      ) : null}

      {!loading && machines.length > 0 ? (
        <>
          <TableContainer sx={{ overflowX: 'auto', flexGrow: 1 }}>
            <Table
              size="small"
              aria-label="Máquinas, pontos, sensores e condição"
              sx={{
                tableLayout: 'fixed',
                '& .MuiTableCell-root': { px: 0.4, py: 0.5, borderColor: 'divider' },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 44, pl: 2 }}>Ponto</TableCell>
                  {machines.map((row) => (
                    <TableCell key={row.machine.id} align="center" sx={{ px: 0.25 }}>
                      <Link
                        component={RouterLink}
                        to={links.machine(row.machine.name, range)}
                        underline="hover"
                        color="inherit"
                        title={`Abrir ${row.machine.name}`}
                        sx={{ fontWeight: 700, fontSize: 10, display: 'block' }}
                        noWrap
                      >
                        {machineTag(row.machine.name)}
                      </Link>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {positions.map((position) => (
                  <TableRow key={position}>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary', pl: 2 }}>
                      {position}
                    </TableCell>
                    {machines.map((row) => {
                      const cell = row.cells.find((item) => item.positionLabel === position);
                      if (!cell) {
                        return (
                          <TableCell key={row.machine.id} align="center">
                            <Typography variant="caption" color="text.disabled">
                              —
                            </Typography>
                          </TableCell>
                        );
                      }
                      const ratio = cell.assessment?.deviationRatio ?? null;
                      const selected =
                        Boolean(cell.preferredSeriesId) &&
                        cell.series.some((item) => item.id === selectedSeriesId);
                      // A granularidade visual da célula é o PONTO — e é para ele que ela
                      // leva. O sensor fica a um clique dali, na própria página do ponto.
                      const clickable = Boolean(cell.pointName);
                      return (
                        <TableCell key={row.machine.id} align="center">
                          <Tooltip arrow title={<CellTooltip cell={cell} nowMs={nowMs} />}>
                            <span>
                              <ButtonBase
                                disabled={!clickable}
                                aria-label={`Abrir ${cell.machineName}, ${cell.pointName}, ${cell.sensorSerial ?? 'sem sensor'}, ${cell.conditionLabel}${ratio !== null ? `, ${formatNumber(ratio, 2)}×` : ''}`}
                                aria-current={selected ? 'true' : undefined}
                                onClick={() => {
                                  if (clickable) {
                                    navigate(links.point(cell.machineName, cell.pointName, range));
                                  }
                                }}
                                sx={{
                                  minWidth: 38,
                                  height: 24,
                                  borderRadius: 1,
                                  display: 'grid',
                                  placeItems: 'center',
                                  border: selected ? `2px solid ${muiTheme.palette.primary.main}` : '2px solid transparent',
                                  '&:hover': { bgcolor: muiTheme.palette.action.hover },
                                  '&:focus-visible': {
                                    outline: `2px solid ${alpha(muiTheme.palette.primary.main, 0.55)}`,
                                  },
                                  '&.Mui-disabled': { opacity: 1 },
                                }}
                              >
                                {cell.condition === 'no-sensor' ? (
                                  <Box
                                    aria-hidden="true"
                                    sx={{
                                      width: 11,
                                      height: 11,
                                      borderRadius: '50%',
                                      border: `1.5px solid ${muiTheme.palette.condition.unclassified}`,
                                    }}
                                  />
                                ) : (
                                  <Box
                                    aria-hidden="true"
                                    sx={{
                                      minWidth: 34,
                                      px: 0.5,
                                      borderRadius: '4px',
                                      bgcolor: severityColor(ratio, muiTheme.palette),
                                      fontSize: 10.5,
                                      fontWeight: 700,
                                      lineHeight: '17px',
                                      color: 'text.primary',
                                      textAlign: 'center',
                                      fontVariantNumeric: 'tabular-nums',
                                    }}
                                  >
                                    {ratio !== null ? `${formatNumber(ratio, 2)}×` : '—'}
                                  </Box>
                                )}
                              </ButtonBase>
                            </span>
                          </Tooltip>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Stack direction="row" flexWrap="wrap" useFlexGap gap={1} sx={{ px: 2, pt: 1.25, pb: 1.5 }}>
            {legend.map((entry) => (
              <Stack key={entry.label} direction="row" alignItems="center" spacing={0.5}>
                <Box
                  aria-hidden="true"
                  sx={{
                    width: 16,
                    height: 8,
                    borderRadius: '2px',
                    bgcolor: severityColor(entry.ratio, muiTheme.palette),
                  }}
                />
                <Typography variant="caption" noWrap color="text.secondary">
                  {entry.label}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </>
      ) : null}
    </DashboardCard>
  );
}
