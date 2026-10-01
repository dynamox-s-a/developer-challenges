import type {
  CreateMachineRequest,
  Machine,
  MachineSortKey,
  MachineType,
} from '@condition-monitor/shared';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/EditOutlined';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router';
import { ConfirmDialog } from '../../components/confirm-dialog';
import { LoadingIndicator } from '../../components/loading-indicator';
import { RetryAlert } from '../../components/retry-alert';
import { SortableTableHead, type SortableColumn } from '../../components/sortable-table-head';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchSectors } from '../sectors/sectors-slice';
import { MachineFormDialog } from './machine-form-dialog';
import {
  createMachine,
  deleteMachine,
  fetchMachines,
  fetchNextNumber,
  updateMachine,
  type MachinesQuery,
} from './machines-slice';

const COLUMNS: SortableColumn<MachineSortKey>[] = [
  { key: 'tag', label: 'Tag' },
  { key: 'name', label: 'Name' },
  { key: 'type', label: 'Type' },
  { key: 'sector', label: 'Sector' },
];

/** Machines of the plant: a server-side paginated, sortable list with create, edit and delete. */
export function MachinesPage() {
  const dispatch = useAppDispatch();
  const { query, page, status, error } = useAppSelector((state) => state.machines);
  const sectors = useAppSelector((state) => state.sectors);
  const [editing, setEditing] = useState<Machine | 'new' | null>(null);
  const [deleting, setDeleting] = useState<Machine | null>(null);

  const load = useCallback(
    (changes: Partial<MachinesQuery>) => dispatch(fetchMachines({ ...query, ...changes })),
    [dispatch, query],
  );

  useEffect(() => {
    void dispatch(fetchSectors());
    void dispatch(fetchMachines(query));
    // Loads once per visit; later changes go through `load`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const suggestNumber = useCallback(
    async (sectorId: string, type: MachineType) => {
      const action = await dispatch(fetchNextNumber({ sectorId, type }));
      return fetchNextNumber.fulfilled.match(action) ? action.payload.number : null;
    },
    [dispatch],
  );

  const save = async (values: CreateMachineRequest) => {
    const action =
      editing && editing !== 'new'
        ? await dispatch(updateMachine({ id: editing.id, changes: values }))
        : await dispatch(createMachine(values));
    if (createMachine.fulfilled.match(action) || updateMachine.fulfilled.match(action)) {
      // The API decides where the machine falls in the current order, so the page reloads.
      void load({});
      return null;
    }
    return (
      action.payload ?? {
        status: null,
        message: 'The machine was not saved.',
        fieldErrors: [],
        reasons: [],
      }
    );
  };

  const remove = async () => {
    if (!deleting) return null;
    const action = await dispatch(deleteMachine(deleting.id));
    if (!deleteMachine.fulfilled.match(action)) {
      return action.payload?.message ?? 'The machine was not deleted.';
    }
    // Deleting the last row of a page steps back to the previous page.
    const lastOnPage = page?.items.length === 1 && query.page > 1;
    void load(lastOnPage ? { page: query.page - 1 } : {});
    return null;
  };

  const noSectors = sectors.status === 'loaded' && sectors.items.length === 0;
  const defaultSectorId = query.sectorId ?? sectors.items[0]?.id ?? null;

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <Typography variant="h5" component="h1" sx={{ flexGrow: 1 }}>
          Machines
        </Typography>
        <TextField
          select
          size="small"
          label="Sector"
          value={query.sectorId ?? ''}
          onChange={(event) => void load({ sectorId: event.target.value || null, page: 1 })}
          // Without displayEmpty, MUI leaves the field blank when "All sectors" is chosen.
          SelectProps={{ displayEmpty: true }}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">All sectors</MenuItem>
          {sectors.items.map((sector) => (
            <MenuItem key={sector.id} value={sector.id}>
              {sector.code} ({sector.name})
            </MenuItem>
          ))}
        </TextField>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setEditing('new')}
          disabled={noSectors}
        >
          New machine
        </Button>
      </Box>

      {noSectors && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Machines are installed in a sector.{' '}
          <Link component={RouterLink} to="/sectors">
            Create a sector
          </Link>{' '}
          first.
        </Alert>
      )}
      {status === 'failed' && <RetryAlert message={error} onRetry={() => void load({})} />}
      {status !== 'failed' && !page && <LoadingIndicator label="Loading machines" />}
      {page && page.total === 0 && status !== 'failed' && !noSectors && (
        <Paper sx={{ p: 3 }}>
          <Typography color="text.secondary">
            {query.sectorId ? 'No machines in this sector yet.' : 'No machines yet.'}
          </Typography>
        </Paper>
      )}
      {page && page.total > 0 && (
        <Paper>
          <TableContainer>
            <Table aria-label="Machines">
              <SortableTableHead
                columns={COLUMNS}
                sort={query.sort}
                order={query.order}
                onSort={(sort, order) => void load({ sort, order, page: 1 })}
              >
                <TableCell align="right">Actions</TableCell>
              </SortableTableHead>
              <TableBody>
                {page.items.map((machine) => (
                  <TableRow key={machine.id} hover>
                    <TableCell sx={{ fontWeight: 500, whiteSpace: 'nowrap' }}>
                      <Link component={RouterLink} to={`/machines/${machine.id}`}>
                        {machine.tag}
                      </Link>
                    </TableCell>
                    <TableCell>{machine.name}</TableCell>
                    <TableCell>{machine.type}</TableCell>
                    <TableCell>{machine.sector.name}</TableCell>
                    <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                      <IconButton
                        aria-label={`Edit machine ${machine.tag}`}
                        onClick={() => setEditing(machine)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label={`Delete machine ${machine.tag}`}
                        onClick={() => setDeleting(machine)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={page.total}
            page={query.page - 1}
            rowsPerPage={query.pageSize}
            rowsPerPageOptions={[10, 25, 50]}
            onPageChange={(_event, zeroBased) => void load({ page: zeroBased + 1 })}
            onRowsPerPageChange={(event) =>
              void load({ pageSize: Number(event.target.value), page: 1 })
            }
          />
        </Paper>
      )}

      <MachineFormDialog
        open={editing !== null}
        machine={editing === 'new' ? null : editing}
        sectors={sectors.items}
        defaultSectorId={defaultSectorId}
        suggestNumber={suggestNumber}
        onSubmit={save}
        onClose={() => setEditing(null)}
      />
      <ConfirmDialog
        open={deleting !== null}
        title={`Delete machine ${deleting?.tag ?? ''}?`}
        confirmLabel="Delete"
        onConfirm={remove}
        onClose={() => setDeleting(null)}
      >
        {deleting?.name} will be removed. This cannot be undone.
      </ConfirmDialog>
    </>
  );
}
