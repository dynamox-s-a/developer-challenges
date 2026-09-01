import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';
import { alpha } from '@mui/material/styles';

import { machineTag } from '@dynamox/domain';
import { EmptyState } from '@dynamox/ui';

import type { DashboardView } from '../../features/dashboard/dashboardAggregations';
import { formatMeasurement } from '../../features/dashboard/dashboardFormatters';
import { links, type AnalyticsRange } from '../../features/investigation/links';
import { DeviationBar } from '../investigation/DeviationBar';
import { TrendSparkline } from '../investigation/TrendSparkline';
import { DashboardCard } from './DashboardCard';
import { ConditionTag } from '../condition/ConditionTag';

/**
 * O painel operacional central: ranking denso das prioridades reais de inspeção.
 * Exceções primeiro; as demais linhas dão o contexto do "resto está normal".
 * Clicar numa linha troca o contexto da tendência crítica.
 */
export interface InspectionPriorityTableProps {
  view: DashboardView;
  loading: boolean;
  evaluating: boolean;
  selectedSeriesId: string | null;
  /** Recorte atual do painel — viaja junto em todo link para não recomeçar a análise. */
  range: AnalyticsRange;
  onInvestigate: (seriesId: string) => void;
}

export function InspectionPriorityTable({
  view,
  loading,
  evaluating,
  selectedSeriesId,
  range,
  onInvestigate,
}: InspectionPriorityTableProps): JSX.Element {
  const evaluated = view.cells.filter((cell) => cell.sensorSerial).length;
  const rows = view.priority;

  return (
    <DashboardCard
      title="Prioridade de inspeção"
      titleId="inspection-priority-title"
      subtitle="Evidência estatística demonstrativa. Não é alarmística industrial validada."
      action={
        !loading && evaluated > 0 ? (
          <Typography variant="caption" color="text.secondary">
            Mostrando {rows.length} de {evaluated} avaliados
          </Typography>
        ) : undefined
      }
      flush
    >
      {loading ? (
        <Stack spacing={1} sx={{ px: 1.75 }} aria-label="Carregando fila de inspeção">
          {[0, 1, 2, 3].map((key) => (
            <Skeleton key={key} variant="rounded" height={40} />
          ))}
        </Stack>
      ) : null}

      {!loading && rows.length === 0 ? (
        <Box sx={{ px: 1.75 }}>
          <EmptyState
            title="Nenhum ponto avaliável"
            description={
              evaluating
                ? 'A avaliação de condição ainda está em andamento.'
                : 'Associe sensores aos pontos para gerar prioridades.'
            }
          />
        </Box>
      ) : null}

      {!loading && rows.length > 0 ? (
        <TableContainer sx={{ overflowX: 'auto', mt: -1 }}>
          <Table
            size="small"
            aria-label="Ranking de prioridade de inspeção"
            // Densidade industrial: menos padding lateral para a tabela caber em 6 colunas.
            sx={{
              '& .MuiTableCell-root': { px: 0.85, py: 0.5, lineHeight: 1.25, borderColor: 'divider' },
              '& td': { fontVariantNumeric: 'tabular-nums' },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 30 }}>#</TableCell>
                <TableCell>Máquina</TableCell>
                <TableCell>Ponto · Sensor</TableCell>
                <TableCell>Severidade</TableCell>
                <TableCell align="right" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                  RMS radial
                </TableCell>
                <TableCell sx={{ whiteSpace: 'normal', lineHeight: 1.25, minWidth: 96 }}>
                  Desvio radial
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                  Tendência (Y)
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((cell, index) => {
                const selected =
                  Boolean(cell.preferredSeriesId) && cell.preferredSeriesId === selectedSeriesId;
                const clickable = Boolean(cell.preferredSeriesId);
                return (
                  <TableRow
                    key={cell.key}
                    hover={clickable}
                    selected={selected}
                    onClick={() => {
                      if (cell.preferredSeriesId) onInvestigate(cell.preferredSeriesId);
                    }}
                    sx={(muiTheme) => ({
                      cursor: clickable ? 'pointer' : 'default',
                      '&.Mui-selected': {
                        bgcolor: alpha(muiTheme.palette.primary.main, 0.07),
                      },
                    })}
                  >
                    <TableCell sx={{ color: 'text.secondary' }}>{index + 1}</TableCell>
                    <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                      {/* Nome curto na tabela densa; o completo vive no title e no tooltip. */}
                      <Link
                        component={RouterLink}
                        to={links.machine(cell.machineName, range)}
                        title={cell.machineName}
                        onClick={(event) => event.stopPropagation()}
                        underline="hover"
                        color="inherit"
                        sx={{ fontWeight: 700 }}
                      >
                        {machineTag(cell.machineName)}
                      </Link>
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      <Link
                        component={RouterLink}
                        to={links.point(cell.machineName, cell.pointName, range)}
                        onClick={(event) => event.stopPropagation()}
                        underline="hover"
                        color="inherit"
                        sx={{ fontWeight: 600, fontSize: '0.8125rem' }}
                      >
                        {cell.positionLabel}
                      </Link>
                      <Typography variant="body2" component="span" color="text.secondary">
                        {' · '}
                      </Typography>
                      {cell.sensorSerial ? (
                        <Link
                          component={RouterLink}
                          to={links.sensor(cell.sensorSerial, range)}
                          onClick={(event) => event.stopPropagation()}
                          underline="hover"
                          color="text.secondary"
                          sx={{ fontSize: '0.8125rem' }}
                        >
                          {cell.sensorSerial}
                        </Link>
                      ) : (
                        <Typography variant="body2" component="span" color="text.secondary">
                          sem sensor
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <ConditionTag kind={cell.condition} />
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        display: { xs: 'none', md: 'table-cell' },
                        whiteSpace: 'nowrap',
                        fontWeight: 600,
                      }}
                    >
                      {cell.evidence
                        ? formatMeasurement(cell.evidence.value, cell.evidence.unit)
                        : '—'}
                    </TableCell>
                    <TableCell>
                      <DeviationBar
                        ratio={cell.assessment?.deviationRatio ?? null}
                        condition={cell.condition}
                        title={
                          cell.evidence
                            ? `${cell.evidence.label}: ${formatMeasurement(cell.evidence.value, cell.evidence.unit)}`
                            : undefined
                        }
                      />
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                      <TrendSparkline
                        trend={view.sparklines[cell.key] ?? []}
                        condition={cell.condition}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : null}
    </DashboardCard>
  );
}
