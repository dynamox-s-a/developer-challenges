import type { CreateSectorRequest, Sector } from '@condition-monitor/shared';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/EditOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { ConfirmDialog } from '../../components/confirm-dialog';
import { LoadingIndicator } from '../../components/loading-indicator';
import { RetryAlert } from '../../components/retry-alert';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { SectorFormDialog } from './sector-form-dialog';
import { createSector, deleteSector, fetchSectors, updateSector } from './sectors-slice';

/** Sectors of the plant (assumption B9): list, create, edit and delete. */
export function SectorsPage() {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.sectors);
  const [editing, setEditing] = useState<Sector | 'new' | null>(null);
  const [deleting, setDeleting] = useState<Sector | null>(null);

  useEffect(() => {
    void dispatch(fetchSectors());
  }, [dispatch]);

  const save = async (values: CreateSectorRequest) => {
    const action =
      editing && editing !== 'new'
        ? await dispatch(updateSector({ id: editing.id, changes: values }))
        : await dispatch(createSector(values));
    return createSector.fulfilled.match(action) || updateSector.fulfilled.match(action)
      ? null
      : (action.payload ?? {
          status: null,
          message: 'The sector was not saved.',
          fieldErrors: [],
          reasons: [],
        });
  };

  const remove = async () => {
    if (!deleting) return null;
    const action = await dispatch(deleteSector(deleting.id));
    return deleteSector.fulfilled.match(action)
      ? null
      : (action.payload?.message ?? 'The sector was not deleted.');
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <Typography variant="h5" component="h1" sx={{ flexGrow: 1 }}>
          Sectors
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setEditing('new')}>
          New sector
        </Button>
      </Box>

      {status === 'failed' && (
        <RetryAlert message={error} onRetry={() => void dispatch(fetchSectors())} />
      )}
      {(status === 'idle' || status === 'loading') && <LoadingIndicator label="Loading sectors" />}
      {status === 'loaded' && items.length === 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography color="text.secondary">
            No sectors yet. Create the first one to start registering machines.
          </Typography>
        </Paper>
      )}
      {status === 'loaded' && items.length > 0 && (
        <TableContainer component={Paper}>
          <Table aria-label="Sectors">
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="right">Machines</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((sector) => (
                <TableRow key={sector.id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{sector.code}</TableCell>
                  <TableCell>{sector.name}</TableCell>
                  <TableCell align="right">{sector.machineCount}</TableCell>
                  <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                    <IconButton
                      aria-label={`Edit sector ${sector.code}`}
                      onClick={() => setEditing(sector)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label={`Delete sector ${sector.code}`}
                      onClick={() => setDeleting(sector)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <SectorFormDialog
        open={editing !== null}
        sector={editing === 'new' ? null : editing}
        onSubmit={save}
        onClose={() => setEditing(null)}
      />
      <ConfirmDialog
        open={deleting !== null}
        title={`Delete sector ${deleting?.code ?? ''}?`}
        confirmLabel="Delete"
        onConfirm={remove}
        onClose={() => setDeleting(null)}
      >
        {deleting?.name} will be removed. This cannot be undone.
      </ConfirmDialog>
    </>
  );
}
