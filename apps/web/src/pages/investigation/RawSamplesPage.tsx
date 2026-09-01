import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useCallback, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { EmptyState, ErrorState, LoadingState } from '@dynamox/ui';

import { api } from '../../api/client';
import { InvestigationBreadcrumbs } from '../../components/investigation/InvestigationBreadcrumbs';
import {
  formatNumber,
  seriesMetricLabel,
} from '../../features/dashboard/dashboardFormatters';
import {
  formatDateTime,
} from '../../features/time/instant';
import { links } from '../../features/investigation/links';
import { useAnalyticsQuery, useTimeRange } from '../../features/investigation/useAnalyticsQuery';

const QUANTITIES = [
  { value: '', label: 'Todas' },
  { value: 'ACCELERATION', label: 'Aceleração' },
  { value: 'TEMPERATURE', label: 'Temperatura' },
  { value: 'ROTATIONAL_SPEED', label: 'Rotação' },
];
const AXES = [
  { value: '', label: 'Todos' },
  { value: 'X', label: 'X' },
  { value: 'Y', label: 'Y' },
  { value: 'Z', label: 'Z' },
  { value: 'NONE', label: 'Sem eixo' },
];
const LIMITS = [100, 250, 500, 1000];

/**
 * NÍVEL FOLHA: telemetria bruta de UMA aquisição.
 *
 * É o único lugar do sistema que devolve amostra individual, e ainda assim recortada pela
 * aquisição e paginada por cursor keyset — nunca por `OFFSET` profundo. Chegar aqui exige
 * ter passado por janela → sensor → aquisição.
 */
export function RawSamplesPage(): JSX.Element {
  const { cycleId = '' } = useParams();
  const [search, setSearch] = useSearchParams();
  const range = useTimeRange();

  const quantity = search.get('quantity') ?? '';
  const axis = search.get('axis') ?? '';
  const limit = Number(search.get('limit') ?? '500');
  // O cursor da página corrente vem da URL; a pilha permite voltar página a página.
  const cursor = search.get('cursor');
  const [history, setHistory] = useState<string[]>([]);

  const query = useAnalyticsQuery(
    () =>
      api.acquisitionSamples(cycleId, {
        limit,
        cursor,
        quantity: quantity || null,
        axis: axis || null,
      }),
    [cycleId, limit, cursor, quantity, axis],
  );

  const setParams = useCallback(
    (patch: Record<string, string | null>) => {
      const next = new URLSearchParams(search);
      for (const [key, value] of Object.entries(patch)) {
        if (value === null) next.delete(key);
        else next.set(key, value);
      }
      setSearch(next);
    },
    [search, setSearch],
  );

  const data = query.data;

  return (
    <Box sx={{ pt: 2, pb: 3 }}>
      <InvestigationBreadcrumbs
        steps={[
          { label: 'Visão geral', to: '/' },
          { label: 'Aquisição', to: links.acquisition(cycleId, range) },
          { label: 'Dados brutos' },
        ]}
      />

      <Typography variant="h1" component="h1">
        Dados brutos da aquisição
      </Typography>
      <Typography variant="caption" color="text.secondary" component="div" sx={{ mt: 0.25, mb: 2 }}>
        Amostras individuais, paginadas por cursor. Este é o último nível da investigação — e o
        único que transporta telemetria crua.
      </Typography>

      <Stack direction="row" gap={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
        <TextField
          select
          size="small"
          label="Grandeza"
          value={quantity}
          onChange={(event) => setParams({ quantity: event.target.value || null, cursor: null })}
          sx={{ minWidth: 160 }}
        >
          {QUANTITIES.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          label="Eixo"
          value={axis}
          onChange={(event) => setParams({ axis: event.target.value || null, cursor: null })}
          sx={{ minWidth: 130 }}
        >
          {AXES.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          label="Amostras por página"
          value={String(limit)}
          onChange={(event) => setParams({ limit: event.target.value, cursor: null })}
          sx={{ minWidth: 180 }}
        >
          {LIMITS.map((option) => (
            <MenuItem key={option} value={String(option)}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      {query.status === 'loading' || query.status === 'idle' ? (
        <LoadingState label="Carregando amostras…" />
      ) : null}
      {query.status === 'failed' ? (
        <ErrorState message={query.error ?? 'Não foi possível carregar as amostras.'} onRetry={query.reload} />
      ) : null}
      {query.status === 'succeeded' && data && data.items.length === 0 ? (
        <EmptyState
          title="Nenhuma amostra com esse recorte"
          description="Ajuste os filtros de grandeza e eixo."
        />
      ) : null}

      {query.status === 'succeeded' && data && data.items.length > 0 ? (
        <Card variant="outlined">
          <TableContainer sx={{ overflowX: 'auto', maxHeight: 520 }}>
            <Table size="small" stickyHeader aria-label="Amostras brutas">
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Grandeza</TableCell>
                  <TableCell>Eixo</TableCell>
                  <TableCell align="right">Valor</TableCell>
                  <TableCell>Unidade</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.items.map((sample) => (
                  <TableRow key={sample.id} hover>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDateTime(sample.timestamp)}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      {seriesMetricLabel(sample.physicalQuantity, null)}
                    </TableCell>
                    <TableCell>{sample.axis ? sample.axis.toUpperCase() : '—'}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      {formatNumber(sample.value, 6)}
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{sample.unit}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={(theme) => ({ px: `${theme.dashboard.cardPadding}px`, py: 1 })}
          >
            <Stack direction="row" gap={0.75} alignItems="center">
              <Chip size="small" variant="outlined" label={`${data.items.length} amostras nesta página`} />
              {data.nextCursor ? null : (
                <Typography variant="caption" color="text.secondary">
                  Fim da aquisição.
                </Typography>
              )}
            </Stack>
            <Stack direction="row" gap={1}>
              <Button
                size="small"
                variant="outlined"
                disabled={history.length === 0}
                onClick={() => {
                  const previous = history.at(-1) ?? null;
                  setHistory((stack) => stack.slice(0, -1));
                  setParams({ cursor: previous });
                }}
              >
                Página anterior
              </Button>
              <Button
                size="small"
                variant="outlined"
                disabled={!data.nextCursor}
                onClick={() => {
                  setHistory((stack) => [...stack, cursor ?? '']);
                  setParams({ cursor: data.nextCursor });
                }}
              >
                Próxima página
              </Button>
            </Stack>
          </Stack>
        </Card>
      ) : null}
    </Box>
  );
}
