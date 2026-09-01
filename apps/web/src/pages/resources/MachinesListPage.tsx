import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import SearchIcon from '@mui/icons-material/Search';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
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
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import {
  isConditionKind,
  machineSlug,
  type MachineListItemDto,
  type MachineListSortColumn,
  type MachineType,
} from '@dynamox/domain';
import { EmptyState, ErrorState } from '@dynamox/ui';

import { api } from '../../api/client';
import { PageHeader } from '../../components/PageHeader';
import { ConditionFilter } from '../../components/condition/ConditionFilter';
import { ConditionTag } from '../../components/condition/ConditionTag';
import { selectCanMutate } from '../../features/auth/authSlice';
import { formatNumber } from '../../features/dashboard/dashboardFormatters';
import { links } from '../../features/investigation/links';
import { useAnalyticsQuery, useTimeRange } from '../../features/investigation/useAnalyticsQuery';
import { useQueryParams } from '../../features/navigation/useQueryParams';
import { TIME_ZONE_LABEL, formatDateTime, formatRelativeTime } from '../../features/time/instant';
import { useAppSelector } from '../../store';
import { DeleteMachineDialog } from './DeleteMachineDialog';

const TYPE_LABELS: Record<MachineType, string> = { Pump: 'Bomba', Fan: 'Ventilador' };

const COLUMNS: Array<{ key: MachineListSortColumn; label: string; align?: 'right' }> = [
  { key: 'name', label: 'Máquina' },
  { key: 'condition', label: 'Condição' },
  { key: 'deviation', label: 'Maior desvio', align: 'right' },
  { key: 'lastAt', label: 'Última leitura' },
];

/**
 * LISTAGEM OPERACIONAL DE MÁQUINAS.
 *
 * A pergunta que ela responde não é "quais máquinas existem" — é "qual delas precisa de
 * mim agora". Por isso o recorte por condição vem antes da tabela, a linha carrega o maior
 * desvio e a última leitura, e o nome é o próprio link.
 *
 * Recorte, busca, ordenação e paginação são resolvidos no SERVIDOR: condição é derivada, e
 * baixar tudo para filtrar no navegador é o padrão que este produto passou uma rodada
 * inteira removendo. Tudo vive na URL — o endereço é a tela.
 */
export function MachinesListPage(): JSX.Element {
  const navigate = useNavigate();
  const canMutate = useAppSelector(selectCanMutate);
  const range = useTimeRange();
  const params = useQueryParams();
  const [pendingDelete, setPendingDelete] = useState<MachineListItemDto | null>(null);
  const [menuFor, setMenuFor] = useState<{ item: MachineListItemDto; anchor: HTMLElement } | null>(null);

  const conditionParam = params.get('condition');
  const condition = isConditionKind(conditionParam) ? conditionParam : null;
  const search = params.get('search') ?? '';
  const page = Number(params.get('page') ?? '1');
  const pageSize = Number(params.get('pageSize') ?? '25');
  const sortByParam = params.get('sortBy');
  const sortBy: MachineListSortColumn = COLUMNS.some((column) => column.key === sortByParam)
    ? (sortByParam as MachineListSortColumn)
    : 'name';
  const sortDir = params.get('sortDir') === 'desc' ? 'desc' : 'asc';

  // Busca digitada: a URL só muda depois da pausa, senão cada tecla vira uma entrada no
  // histórico e um "voltar" que não volta.
  const [draftSearch, setDraftSearch] = useState(search);
  useEffect(() => setDraftSearch(search), [search]);
  useEffect(() => {
    if (draftSearch === search) return;
    const timer = setTimeout(
      () => params.set({ search: draftSearch || null, page: null }, { replace: true }),
      300,
    );
    return () => clearTimeout(timer);
  }, [draftSearch, search, params]);

  const query = useAnalyticsQuery(
    () =>
      api.machineList(
        { from: range.from, to: range.to },
        { condition, search: search || null, page, pageSize, sortBy, sortDir },
      ),
    [range.from, range.to, condition, search, page, pageSize, sortBy, sortDir],
  );
  const data = query.data;

  const rows = useMemo(() => data?.items ?? [], [data]);
  const filtering = condition !== null || search !== '';

  const sortHeader = (column: (typeof COLUMNS)[number]) => (
    <TableSortLabel
      active={sortBy === column.key}
      direction={sortBy === column.key ? sortDir : 'asc'}
      onClick={() =>
        params.set(
          {
            sortBy: column.key,
            sortDir: sortBy === column.key && sortDir === 'asc' ? 'desc' : 'asc',
            page: null,
          },
          { replace: true },
        )
      }
    >
      {column.label}
    </TableSortLabel>
  );

  return (
    <Box sx={{ pb: 3 }}>
      <PageHeader
        steps={[{ label: 'Visão geral', to: '/' }, { label: 'Máquinas' }]}
        title="Máquinas"
        subtitle={`Ativos da planta com a condição do período. Abrir uma máquina mostra operação e cadastro no mesmo lugar. Horários em ${TIME_ZONE_LABEL}.`}
        actions={
          canMutate ? (
            <Button component={RouterLink} to="/machines/new" variant="contained" startIcon={<AddIcon />}>
              Nova máquina
            </Button>
          ) : undefined
        }
      />

      {!canMutate ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          Seu perfil é somente leitura: as máquinas podem ser consultadas, mas criar, editar e
          excluir exigem um perfil administrador.
        </Alert>
      ) : null}

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        gap={1.5}
        alignItems={{ md: 'center' }}
        justifyContent="space-between"
        sx={{ mb: 1.5 }}
      >
        {data ? (
          <ConditionFilter
            counts={data.counts}
            value={condition}
            label="Filtrar máquinas por condição"
            onChange={(next) => params.set({ condition: next, page: null })}
          />
        ) : (
          <Skeleton variant="rounded" width={320} height={34} />
        )}

        <TextField
          size="small"
          value={draftSearch}
          onChange={(event) => setDraftSearch(event.target.value)}
          placeholder="Buscar por identificação"
          inputProps={{ 'aria-label': 'Buscar máquina por identificação' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ width: { xs: '100%', md: 260 } }}
        />
      </Stack>

      {query.status === 'failed' ? (
        <ErrorState
          message={query.error ?? 'Não foi possível carregar as máquinas.'}
          onRetry={query.reload}
        />
      ) : null}

      {query.status !== 'failed' ? (
        <Card variant="outlined">
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table
              size="small"
              aria-label="Máquinas cadastradas"
              sx={{
                '& .MuiTableCell-root': { px: 1.25, py: 0.75, borderColor: 'divider' },
                '& td': { fontVariantNumeric: 'tabular-nums' },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: '30%' }}>{sortHeader(COLUMNS[0])}</TableCell>
                  <TableCell sx={{ width: '10%', display: { xs: 'none', md: 'table-cell' } }}>Tipo</TableCell>
                  <TableCell sx={{ width: '13%' }}>{sortHeader(COLUMNS[1])}</TableCell>
                  <TableCell align="right" sx={{ width: '11%' }}>
                    Sensores
                  </TableCell>
                  <TableCell align="right" sx={{ width: '14%' }}>
                    {sortHeader(COLUMNS[2])}
                  </TableCell>
                  <TableCell sx={{ width: '16%', display: { xs: 'none', sm: 'table-cell' } }}>
                    {sortHeader(COLUMNS[3])}
                  </TableCell>
                  <TableCell align="right" sx={{ width: 56 }}>
                    Ações
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {query.status !== 'succeeded' && rows.length === 0
                  ? Array.from({ length: 5 }, (_, index) => (
                      <TableRow key={`skeleton-${index}`}>
                        <TableCell colSpan={7}>
                          <Skeleton variant="text" height={26} />
                        </TableCell>
                      </TableRow>
                    ))
                  : null}

                {rows.map((item) => (
                  <TableRow key={item.machineId} hover>
                    <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                      <Link
                        component={RouterLink}
                        to={links.machine(item.machineName, range)}
                        underline="hover"
                        color="inherit"
                      >
                        {item.machineName}
                      </Link>
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary', display: { xs: 'none', md: 'table-cell' } }}>
                      {TYPE_LABELS[item.machineType]}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" gap={0.75}>
                        <ConditionTag kind={item.condition} />
                        {item.attentionCount > 0 ? (
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {item.attentionCount === 1
                              ? '1 ponto'
                              : `${item.attentionCount} pontos`}
                          </Typography>
                        ) : null}
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip
                        arrow
                        title={`${item.sensorCount} de ${item.pointCount} ponto(s) com sensor instalado`}
                      >
                        <span>
                          {item.sensorCount}
                          <Typography component="span" variant="caption" color="text.secondary">
                            {` / ${item.pointCount}`}
                          </Typography>
                        </span>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                      {item.maxDeviationRatio === null ? (
                        <Typography variant="caption" color="text.secondary">
                          —
                        </Typography>
                      ) : (
                        <Tooltip arrow title={`Maior desvio em ${item.maxDeviationPoint ?? '—'}`}>
                          <Box component="span" sx={{ fontWeight: 600 }}>
                            {formatNumber(item.maxDeviationRatio, 2)}×
                          </Box>
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell
                      sx={{ color: 'text.secondary', whiteSpace: 'nowrap', display: { xs: 'none', sm: 'table-cell' } }}
                      title={`${formatDateTime(item.lastAt)} ${TIME_ZONE_LABEL}`}
                    >
                      {formatRelativeTime(item.lastAt)}
                    </TableCell>
                    <TableCell align="right" padding="none" sx={{ pr: 1 }}>
                      <IconButton
                        size="small"
                        aria-label={`Ações de ${item.machineName}`}
                        onClick={(event) => setMenuFor({ item, anchor: event.currentTarget })}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {query.status === 'succeeded' && rows.length === 0 ? (
            <EmptyState
              title={filtering ? 'Nenhuma máquina neste recorte' : 'Nenhuma máquina cadastrada'}
              description={
                filtering
                  ? 'Nenhum ativo corresponde ao filtro de condição e à busca aplicados neste período.'
                  : 'Cadastre a primeira máquina para começar a monitorar a planta.'
              }
              action={
                filtering ? (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => params.set({ condition: null, search: null, page: null })}
                  >
                    Limpar filtros
                  </Button>
                ) : canMutate ? (
                  <Button component={RouterLink} to="/machines/new" variant="contained" startIcon={<AddIcon />}>
                    Nova máquina
                  </Button>
                ) : undefined
              }
            />
          ) : null}

          {data && data.totalPages > 1 ? (
            <TablePagination
              component="div"
              count={data.total}
              page={data.page - 1}
              onPageChange={(_event, next) => params.set({ page: String(next + 1) })}
              rowsPerPage={data.pageSize}
              rowsPerPageOptions={[25, 50, 100]}
              onRowsPerPageChange={(event) => params.set({ pageSize: event.target.value, page: null })}
              labelRowsPerPage="Itens por página"
              labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
              getItemAriaLabel={(type) =>
                type === 'previous' ? 'Ir para a página anterior' : 'Ir para a próxima página'
              }
            />
          ) : null}
        </Card>
      ) : null}

      <Menu
        open={menuFor !== null}
        anchorEl={menuFor?.anchor ?? null}
        onClose={() => setMenuFor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          onClick={() => {
            if (menuFor) navigate(links.machine(menuFor.item.machineName, range));
            setMenuFor(null);
          }}
        >
          <ListItemIcon>
            <OpenInNewOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Abrir máquina</ListItemText>
        </MenuItem>
        <MenuItem
          disabled={!canMutate}
          onClick={() => {
            if (menuFor) {
              navigate(`/machines/${encodeURIComponent(machineSlug(menuFor.item.machineName))}/edit`);
            }
            setMenuFor(null);
          }}
        >
          <ListItemIcon>
            <EditOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <MenuItem
          disabled={!canMutate}
          onClick={() => {
            setPendingDelete(menuFor?.item ?? null);
            setMenuFor(null);
          }}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <DeleteOutlineIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Excluir</ListItemText>
        </MenuItem>
      </Menu>

      <DeleteMachineDialog
        machine={
          pendingDelete
            ? {
                id: pendingDelete.machineId,
                name: pendingDelete.machineName,
                type: pendingDelete.machineType,
                createdAt: '',
                updatedAt: '',
              }
            : null
        }
        pointCount={pendingDelete?.pointCount ?? 0}
        sensorCount={pendingDelete?.sensorCount ?? 0}
        onClose={() => setPendingDelete(null)}
        onDeleted={() => {
          setPendingDelete(null);
          query.reload();
        }}
      />
    </Box>
  );
}
