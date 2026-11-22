import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  IconButton,
  LinearProgress,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SensorsIcon from '@mui/icons-material/Sensors';
import type {
  MonitoringPointListQuery,
  MonitoringPointSortField,
} from '@dynapredict/shared';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchMonitoringPoints,
  type MonitoringPoint,
} from './monitoring-points.slice';
import { NewMonitoringPointDialog } from './new-monitoring-point-dialog';
import { SensorDialog } from './sensor-dialog';

const PAGE_SIZE = 5;

// As colunas da tabela. Todas podem ser usadas para ordenar
const COLUMNS: { field: MonitoringPointSortField; label: string }[] = [
  { field: 'machineName', label: 'Máquina' },
  { field: 'machineType', label: 'Tipo' },
  { field: 'pointName', label: 'Ponto' },
  { field: 'sensorModel', label: 'Sensor' },
];

// Textos dos botões de página, que o MUI traz em inglês
const PAGINATION_LABELS = {
  first: 'Primeira página',
  last: 'Última página',
  next: 'Próxima página',
  previous: 'Página anterior',
};

type PointsTableProps = {
  points: MonitoringPoint[];
  query: MonitoringPointListQuery;
  onSort: (field: MonitoringPointSortField) => void;
  onEditSensor: (point: MonitoringPoint) => void;
};

function PointsTable({
  points,
  query,
  onSort,
  onEditSensor,
}: PointsTableProps) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {COLUMNS.map(({ field, label }) => {
              const active = query.sortBy === field;
              return (
                <TableCell
                  key={field}
                  // Diz aos leitores de tela qual coluna ordena e em que direção
                  sortDirection={active ? query.order : false}
                >
                  <TableSortLabel
                    active={active}
                    direction={active ? query.order : 'asc'}
                    onClick={() => onSort(field)}
                  >
                    {label}
                  </TableSortLabel>
                </TableCell>
              );
            })}
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {points.map((point) => (
            <TableRow key={point.id}>
              <TableCell>{point.machine.name}</TableCell>
              <TableCell>{point.machine.type}</TableCell>
              <TableCell>{point.name}</TableCell>
              <TableCell>
                {point.sensor ? (
                  <>
                    {point.sensor.model}
                    <Typography variant="body2" color="text.secondary">
                      {point.sensor.serialNumber}
                    </Typography>
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Sem sensor
                  </Typography>
                )}
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Sensor">
                  {/* O nome da máquina entra no rótulo porque pontos de
                      máquinas diferentes podem ter o mesmo nome */}
                  <IconButton
                    aria-label={`Sensor de ${point.name} (${point.machine.name})`}
                    onClick={() => onEditSensor(point)}
                  >
                    <SensorsIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function MonitoringPointsPage() {
  const dispatch = useAppDispatch();
  const { items, total, status, error } = useAppSelector(
    (state) => state.monitoringPoints,
  );

  // A página e a ordem que o usuário escolheu. Mudou? Busca de novo na API
  const [query, setQuery] = useState<MonitoringPointListQuery>({
    page: 1,
    pageSize: PAGE_SIZE,
    sortBy: 'machineName',
    order: 'asc',
  });

  // O diálogo de ponto novo está aberto?
  const [formOpen, setFormOpen] = useState(false);
  // O ponto com o diálogo do sensor aberto (null = nenhum)
  const [sensorPoint, setSensorPoint] = useState<MonitoringPoint | null>(null);
  // Mensagem de sucesso que aparece no rodapé (null = nenhuma)
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const request = dispatch(fetchMonitoringPoints(query));
    // Trocou de página (ou saiu dela) antes da resposta? Cancela a busca
    // antiga, para uma resposta atrasada não aparecer no lugar da nova
    return () => request.abort();
  }, [dispatch, query]);

  function handleSort(field: MonitoringPointSortField) {
    setQuery((current) => ({
      ...current,
      page: 1, // outra ordem: volta para o começo da lista
      sortBy: field,
      // Clicar de novo na mesma coluna inverte a ordem
      order:
        current.sortBy === field && current.order === 'asc' ? 'desc' : 'asc',
    }));
  }

  function handleCreated(message: string) {
    setFormOpen(false);
    setNotice(message);
    // A lista vem ordenada e paginada pela API: busca a página de novo
    dispatch(fetchMonitoringPoints(query));
  }

  function handleSensorSaved(message: string) {
    setSensorPoint(null);
    setNotice(message);
    // O sensor aparece na lista, e a ordem por sensor pode mudar
    dispatch(fetchMonitoringPoints(query));
  }

  return (
    <Stack spacing={2}>
      <Stack
        direction="row"
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography variant="h4">Pontos de monitoramento</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setFormOpen(true)}
        >
          Novo ponto
        </Button>
      </Stack>

      {/* Uma barra fina no topo: a tabela antiga continua à vista enquanto
          a próxima página carrega */}
      {status === 'loading' && (
        <LinearProgress aria-label="Carregando pontos de monitoramento" />
      )}

      {status === 'failed' && (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              onClick={() => dispatch(fetchMonitoringPoints(query))}
            >
              Tentar de novo
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {status === 'succeeded' && total === 0 && (
        <Typography color="text.secondary">
          Nenhum ponto de monitoramento cadastrado ainda.
        </Typography>
      )}

      {items.length > 0 && (
        <Paper>
          <PointsTable
            points={items}
            query={query}
            onSort={handleSort}
            onEditSensor={setSensorPoint}
          />
          <TablePagination
            component="div"
            count={total}
            // O MUI conta as páginas a partir de 0; a API, a partir de 1
            page={query.page - 1}
            onPageChange={(_event, page) =>
              setQuery((current) => ({ ...current, page: page + 1 }))
            }
            rowsPerPage={PAGE_SIZE}
            rowsPerPageOptions={[PAGE_SIZE]}
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} de ${count}`
            }
            getItemAriaLabel={(type) => PAGINATION_LABELS[type]}
          />
        </Paper>
      )}

      {formOpen && (
        <NewMonitoringPointDialog
          onClose={() => setFormOpen(false)}
          onCreated={handleCreated}
        />
      )}

      {sensorPoint && (
        <SensorDialog
          point={sensorPoint}
          onClose={() => setSensorPoint(null)}
          onSaved={handleSensorSaved}
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
