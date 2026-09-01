import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import {
  ALERT_LEVELS,
  ALERT_LIST_SORT_COLUMNS,
  ALERT_STATUS_FILTERS,
  ALERT_TYPES,
  type AlertListSortColumn,
  type AlertStatusFilter,
  machineTag,
} from '@dynamox/domain';
import { EmptyState, ErrorState } from '@dynamox/ui';

import { api } from '../../api/client';
import { PageHeader } from '../../components/PageHeader';
import { AlertLevelTag, AlertStatusTag } from '../../components/alerts/AlertLevelTag';
import { ALERT_TYPE_LABELS, ALERT_TYPE_SHORT, alertIdentity, alertSummary, formatMagnitude } from '../../features/alerts/alertLabels';
import { links } from '../../features/investigation/links';
import { useAnalyticsQuery } from '../../features/investigation/useAnalyticsQuery';
import { useQueryParams } from '../../features/navigation/useQueryParams';
import { TIME_ZONE_LABEL, formatShortDateTime } from '../../features/time/instant';

const PAGE_SIZES = [25, 50, 100];
const STATUS_OPTIONS: Array<{ value: AlertStatusFilter | 'all'; label: string }> = [
  { value: 'active', label: 'Ativos' },
  { value: 'open', label: 'Abertos' },
  { value: 'acknowledged', label: 'Reconhecidos' },
  { value: 'resolved', label: 'Resolvidos' },
  { value: 'all', label: 'Todos' },
];

function pick<T extends string>(value: string | null, allowed: readonly T[]): T | null {
  return value !== null && (allowed as readonly string[]).includes(value) ? (value as T) : null;
}

/**
 * LISTAGEM DE ALERTAS — episódios persistidos pelo motor, com ciclo de vida próprio.
 *
 * O recorte mora na URL (compartilhável, "voltar" desfaz o filtro) e é resolvido no
 * servidor: status, nível, tipo, máquina, sensor e paginação. O padrão é "o que está ativo
 * agora" — a pergunta operacional —, e `counts` vem do universo antes do recorte por
 * status para o seletor mostrar quantos há em cada estado.
 */
export function AlertsListPage(): JSX.Element {
  const params = useQueryParams();
  const navigate = useNavigate();

  const statusParam = params.get('status');
  const status: AlertStatusFilter | null = statusParam === 'all' ? null : (pick(statusParam, ALERT_STATUS_FILTERS) ?? 'active');
  const level = pick(params.get('level'), ALERT_LEVELS);
  const type = pick(params.get('type'), ALERT_TYPES);
  const machine = params.get('machine');
  const sensor = params.get('sensor');
  const search = params.get('search') ?? '';
  const from = params.get('from');
  const to = params.get('to');
  const page = Math.max(1, Number(params.get('page') ?? '1') || 1);
  // 50 por página: uma operação real acumula centenas de episódios encerrados.
  const pageSizeParam = Number(params.get('pageSize') ?? '50');
  const pageSize = PAGE_SIZES.includes(pageSizeParam) ? pageSizeParam : 50;
  const sortBy = pick(params.get('sortBy'), ALERT_LIST_SORT_COLUMNS) ?? 'openedAt';
  const sortDir = params.get('sortDir') === 'asc' ? 'asc' : 'desc';

  const query = useAnalyticsQuery(
    () => api.alerts({ status, level, type, machine, sensor, search: search || null, from, to, page, pageSize, sortBy, sortDir }),
    [status, level, type, machine, sensor, search, from, to, page, pageSize, sortBy, sortDir],
  );

  // Busca digitada: a URL só muda depois da pausa — cada tecla não vira entrada no histórico.
  const [draftSearch, setDraftSearch] = useState(search);
  useEffect(() => setDraftSearch(search), [search]);
  useEffect(() => {
    if (draftSearch === search) return;
    const timer = window.setTimeout(
      () => params.set({ search: draftSearch || null, page: null }, { replace: true }),
      350,
    );
    return () => window.clearTimeout(timer);
  }, [draftSearch, search, params]);
  /**
   * Opções de recorte por ativo. Uma requisição só: o cadastro de pontos já traz máquina e
   * sensor, e a planta tem dezenas de linhas — não vale um endpoint novo para isto.
   */
  const inventory = useAnalyticsQuery(() => api.allMonitoringPoints(), []);
  const machines = [...new Set((inventory.data ?? []).map((point) => point.machine.name))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
  const sensors = [...new Set((inventory.data ?? []).flatMap((point) => (point.sensor ? [point.sensor.serialNumber] : [])))].sort();
  const data = query.data;
  const loading = query.status === 'loading' || query.status === 'idle';

  const setFilter = (patch: Record<string, string | null>) => params.set({ ...patch, page: null });
  const toggleSort = (column: AlertListSortColumn) => {
    if (sortBy === column) params.set({ sortDir: sortDir === 'desc' ? 'asc' : 'desc', page: null });
    else params.set({ sortBy: column, sortDir: 'desc', page: null });
  };

  const counts = data?.counts;
  const countFor = (value: AlertStatusFilter | 'all'): number | null => {
    if (!counts) return null;
    switch (value) {
      case 'active':
        return counts.activeA1 + counts.activeA2;
      case 'open':
        return counts.open;
      case 'acknowledged':
        return counts.acknowledged;
      case 'resolved':
        return counts.resolved;
      default:
        return counts.total;
    }
  };

  const scopeChips = [
    from || to ? (
      <Chip
        key="window"
        size="small"
        label={`Ativos entre ${formatShortDateTime(from) ?? '…'} e ${formatShortDateTime(to) ?? '…'} (${TIME_ZONE_LABEL})`}
        onDelete={() => setFilter({ from: null, to: null })}
      />
    ) : null,
  ].filter(Boolean);

  return (
    <Box>
      <PageHeader
        steps={[{ label: 'Visão geral', to: '/' }, { label: 'Alertas' }]}
        title="Alertas"
        subtitle={
          <Box component="span" sx={{ display: 'block', maxWidth: 820 }}>
            Episódios abertos pelo motor quando uma regra da política v1 dispara — A1 é alerta, A2 é crítico. Alerta é
            diferente da condição do painel: aqui a referência é a baseline aprendida de cada ponto, e cada linha tem
            abertura, escalada, reconhecimento e resolução próprios.
          </Box>
        }
        chips={
          <>
            {counts ? (
              <Chip size="small" variant="outlined" label={`${counts.activeA2} em A2 · ${counts.activeA1} em A1 ativos`} />
            ) : null}
            {scopeChips}
          </>
        }
      />

      <Card variant="outlined">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          gap={1.5}
          alignItems={{ xs: 'stretch', md: 'center' }}
          justifyContent="space-between"
          sx={(theme) => ({ px: `${theme.dashboard.cardPadding}px`, py: 1.5, borderBottom: 1, borderColor: 'divider' })}
        >
          <ToggleButtonGroup
            size="small"
            exclusive
            value={status ?? 'all'}
            onChange={(_event, value: AlertStatusFilter | 'all' | null) => {
              if (value) setFilter({ status: value });
            }}
            aria-label="Recorte por status"
          >
            {STATUS_OPTIONS.map((option) => {
              const count = countFor(option.value);
              return (
                <ToggleButton key={option.value} value={option.value} aria-label={option.label}>
                  {option.label}
                  {count !== null ? (
                    <Box component="span" sx={{ ml: 0.6, opacity: 0.7, fontVariantNumeric: 'tabular-nums' }}>
                      {count}
                    </Box>
                  ) : null}
                </ToggleButton>
              );
            })}
          </ToggleButtonGroup>

          <Stack direction="row" gap={1} flexWrap="wrap" useFlexGap>
            <TextField
              size="small"
              label="Buscar"
              placeholder="sensor, máquina ou ponto"
              value={draftSearch}
              onChange={(event) => setDraftSearch(event.target.value)}
              sx={{ minWidth: 200 }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="alerts-level-label">Nível</InputLabel>
              <Select
                labelId="alerts-level-label"
                label="Nível"
                value={level ?? ''}
                onChange={(event) => setFilter({ level: event.target.value === '' ? null : String(event.target.value) })}
              >
                <MenuItem value="">Todos</MenuItem>
                {ALERT_LEVELS.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 210 }}>
              <InputLabel id="alerts-type-label">Tipo</InputLabel>
              <Select
                labelId="alerts-type-label"
                label="Tipo"
                value={type ?? ''}
                onChange={(event) => setFilter({ type: event.target.value === '' ? null : String(event.target.value) })}
              >
                <MenuItem value="">Todos</MenuItem>
                {ALERT_TYPES.map((item) => (
                  <MenuItem key={item} value={item}>
                    {ALERT_TYPE_LABELS[item]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="alerts-machine-label">Máquina</InputLabel>
              <Select
                labelId="alerts-machine-label"
                label="Máquina"
                value={machine && (machines.length === 0 || machines.includes(machine)) ? machine : ''}
                onChange={(event) => setFilter({ machine: event.target.value === '' ? null : String(event.target.value) })}
              >
                <MenuItem value="">Todas</MenuItem>
                {machines.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="alerts-sensor-label">Sensor</InputLabel>
              <Select
                labelId="alerts-sensor-label"
                label="Sensor"
                value={sensor && (sensors.length === 0 || sensors.includes(sensor)) ? sensor : ''}
                onChange={(event) => setFilter({ sensor: event.target.value === '' ? null : String(event.target.value) })}
              >
                <MenuItem value="">Todos</MenuItem>
                {sensors.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Stack>

        {query.status === 'failed' ? (
          <Box sx={{ p: 2 }}>
            <ErrorState message={query.error ?? 'Falha ao listar alertas.'} onRetry={query.reload} />
          </Box>
        ) : null}

        {loading ? (
          <Stack spacing={1} sx={{ p: 2 }} role="status" aria-label="Carregando alertas">
            {[0, 1, 2, 3, 4].map((key) => (
              <Skeleton key={key} variant="text" height={30} />
            ))}
          </Stack>
        ) : null}

        {!loading && data && data.items.length === 0 ? (
          <Box sx={{ p: 2 }}>
            <EmptyState
              title={status === 'active' ? 'Nenhum alerta ativo' : 'Nenhum alerta neste recorte'}
              description={
                status === 'active'
                  ? 'Nenhuma regra da política está disparada agora. Os episódios resolvidos continuam disponíveis em "Resolvidos".'
                  : 'Ajuste o status, o nível, o tipo ou a busca — ou remova o recorte por máquina e sensor.'
              }
            />
          </Box>
        ) : null}

        {!loading && data && data.items.length > 0 ? (
          <>
            <TableContainer>
              <Table size="small" aria-label="Alertas">
                <TableHead>
                  <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell sortDirection={sortBy === 'level' ? sortDir : false}>
                      <TableSortLabel active={sortBy === 'level'} direction={sortBy === 'level' ? sortDir : 'desc'} onClick={() => toggleSort('level')}>
                        Nível
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Onde</TableCell>
                    <TableCell sortDirection={sortBy === 'openedAt' ? sortDir : false}>
                      <TableSortLabel active={sortBy === 'openedAt'} direction={sortBy === 'openedAt' ? sortDir : 'desc'} onClick={() => toggleSort('openedAt')}>
                        Aberto em ({TIME_ZONE_LABEL})
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sortDirection={sortBy === 'lastEvaluatedAt' ? sortDir : false}>
                      <TableSortLabel
                        active={sortBy === 'lastEvaluatedAt'}
                        direction={sortBy === 'lastEvaluatedAt' ? sortDir : 'desc'}
                        onClick={() => toggleSort('lastEvaluatedAt')}
                      >
                        Última evidência
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">Medida</TableCell>
                    <TableCell align="right">Pico</TableCell>
                    <TableCell align="right" sx={{ width: 72 }}>
                      Ação
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.items.map((alert) => {
                    const identity = alertIdentity(alert);
                    return (
                      <TableRow
                        key={alert.id}
                        hover
                        onClick={() => navigate(links.alert(alert.id))}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell>
                          <AlertStatusTag status={alert.status} />
                        </TableCell>
                        <TableCell>
                          <AlertLevelTag level={alert.level} status={alert.status} label={alert.level} />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                            {ALERT_TYPE_SHORT[alert.type]}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" component="div" noWrap title={alertSummary(alert)}>
                            {alertSummary(alert)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {alert.scope === 'fleet' ? (
                            <Typography variant="body2" noWrap>
                              {identity}
                            </Typography>
                          ) : (
                            <>
                              <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap title={alert.machineName ?? undefined}>
                                {alert.machineName ? machineTag(alert.machineName) : '—'} · {alert.monitoringPointName ?? '—'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" component="div" noWrap>
                                {alert.sensorSerialNumber ?? 'sem sensor'}
                                {alert.sensorModel ? ` · ${alert.sensorModel}` : ''}
                              </Typography>
                            </>
                          )}
                        </TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatShortDateTime(alert.openedAt)}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          {formatShortDateTime(alert.lastEvaluatedAt)}
                          {alert.resolvedAt ? (
                            <Typography variant="caption" color="text.secondary" component="div">
                              resolvido {formatShortDateTime(alert.resolvedAt)}
                            </Typography>
                          ) : null}
                        </TableCell>
                        <TableCell align="right" sx={{ fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                          {formatMagnitude(alert.last, alert.thresholdMode)}
                        </TableCell>
                        <TableCell align="right" sx={{ fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                          {formatMagnitude(alert.peak, alert.thresholdMode)}
                        </TableCell>
                        <TableCell align="right">
                          {/* Link real: a linha inteira é clicável, mas quem navega por teclado precisa de um destino. */}
                          <Link
                            component={RouterLink}
                            to={links.alert(alert.id)}
                            onClick={(event) => event.stopPropagation()}
                            aria-label={`Abrir alerta ${alert.level} ${ALERT_TYPE_SHORT[alert.type]} em ${identity}`}
                            sx={{ fontWeight: 650, whiteSpace: 'nowrap' }}
                          >
                            Abrir
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={data.total}
              page={data.page - 1}
              rowsPerPage={data.pageSize}
              rowsPerPageOptions={PAGE_SIZES}
              onPageChange={(_event, next) => params.set({ page: String(next + 1) })}
              onRowsPerPageChange={(event) => params.set({ pageSize: event.target.value, page: null })}
              labelRowsPerPage="Por página"
              labelDisplayedRows={({ from: start, to: end, count }) => `${start}–${end} de ${count}`}
            />
          </>
        ) : null}
      </Card>

      <Typography variant="caption" color="text.secondary" component="p" sx={{ mt: 1.5 }}>
        Os tipos descrevem a regra que disparou, não a causa. Um alerta de vibração diz que o RMS radial ficou acima da
        baseline aprendida do ponto por leituras consecutivas — o diagnóstico é de quem inspeciona. Detalhes em{' '}
        <Link component={RouterLink} to="/alerts">
          cada episódio
        </Link>
        .
      </Typography>
    </Box>
  );
}
