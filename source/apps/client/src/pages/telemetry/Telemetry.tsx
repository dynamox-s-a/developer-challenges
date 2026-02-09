import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Container, 
  Typography, 
  Stack, 
  Box, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { GridSortModel } from '@mui/x-data-grid';
import { AppDispatch, RootState } from 'store/store';
import { fetchTelemetry, deleteTelemetry } from 'store/slices/telemetrySlice';
import PageTitle from 'components/common/PageTitle';
import TelemetryTable from 'components/sections/telemetry/TelemetryTable';
import IconifyIcon from 'components/base/IconifyIcon';

const Telemetry = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, total, status } = useSelector((state: RootState) => state.telemetry);
  const [page, setPage] = useState(1);
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: 'timestamp', sort: 'desc' }
  ]);
  
  const [selectionModel, setSelectionModel] = useState<any[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [idsToDelete, setIdsToDelete] = useState<number[]>([]);

  useEffect(() => {
    const sort = sortModel[0];
    dispatch(fetchTelemetry({ 
      page, 
      limit: 10,
      sortField: sort?.field,
      sortOrder: sort?.sort
    }));
  }, [dispatch, page, sortModel]);

  const handleDeleteClick = useCallback((ids: number | number[]) => {
    const idsArray = Array.isArray(ids) ? ids : [ids];
    setIdsToDelete(idsArray);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = async () => {
    await dispatch(deleteTelemetry(idsToDelete));
    setDeleteDialogOpen(false);
    setSelectionModel((prev) => prev.filter(id => !idsToDelete.includes(id as number)));
  };

  const handleCloseDialog = () => {
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <PageTitle title="Telemetry Registries" />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Telemetry Registries
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Historical records of all sensor readings
            </Typography>
          </Box>
          {selectionModel.length > 0 && (
            <Button
              variant="contained"
              color="error"
              startIcon={<IconifyIcon icon="tabler:trash" />}
              onClick={() => handleDeleteClick(selectionModel as number[])}
              sx={{ fontWeight: 600 }}
            >
              Delete Selected ({selectionModel.length})
            </Button>
          )}
        </Stack>

        <TelemetryTable 
          telemetry={items}
          loading={status === 'loading'}
          total={total}
          page={page}
          onPaginationChange={setPage}
          onDelete={handleDeleteClick}
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          selectionModel={selectionModel}
          onSelectionModelChange={setSelectionModel}
        />
      </Container>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        PaperProps={{
          sx: { borderRadius: 3, p: 1 }
        }}
      >
        <DialogTitle id="delete-dialog-title" sx={{ fontWeight: 700 }}>
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete {idsToDelete.length === 1 ? 'this registry' : `${idsToDelete.length} registries`}? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog} color="inherit" sx={{ fontWeight: 600 }}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained" 
            autoFocus
            sx={{ fontWeight: 600 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Telemetry;
