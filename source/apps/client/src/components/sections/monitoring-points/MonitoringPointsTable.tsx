import { useMemo, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { 
  Typography, 
  Box, 
  Chip, 
  IconButton, 
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { MonitoringPoint, deleteMonitoringPoint } from 'store/slices/monitoringPointsSlice';
import IconifyIcon from 'components/base/IconifyIcon';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'store/store';

interface MonitoringPointsTableProps {
  monitoringPoints: MonitoringPoint[];
  loading: boolean;
  total: number;
  onPaginationChange: (page: number) => void;
  page: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

const MonitoringPointsTable = ({ 
  monitoringPoints, 
  loading, 
  total, 
  onPaginationChange, 
  page,
  sortBy,
  sortOrder,
  onSortChange
}: MonitoringPointsTableProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pointToDelete, setPointToDelete] = useState<MonitoringPoint | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteClick = (point: MonitoringPoint) => {
    setPointToDelete(point);
    setError(null);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!pointToDelete) return;

    setIsDeleting(true);
    setError(null);
    try {
      await dispatch(deleteMonitoringPoint(pointToDelete.id)).unwrap();
      setDeleteDialogOpen(false);
      setPointToDelete(null);
    } catch (err: any) {
      console.error('Failed to delete monitoring point:', err);
      // Capture the error message from the API if available
      const message = err?.message || 'Failed to delete monitoring point';
      setError(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setPointToDelete(null);
    setError(null);
  };

  const columns: GridColDef<MonitoringPoint>[] = useMemo(() => [
    {
      field: 'id',
      headerName: 'ID',
      flex: 0.5,
      minWidth: 60,
      renderHeader: () => (
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          ID
        </Typography>
      ),
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Typography variant="body2" color="text.disabled" sx={{ fontWeight: 500 }}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'name',
      headerName: 'Point Name',
      flex: 1.5,
      minWidth: 150,
      sortable: false,
      renderHeader: () => (
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          Point Name
        </Typography>
      ),
    },
    {
      field: 'machine',
      headerName: 'Machine',
      flex: 1.5,
      minWidth: 150,
      sortable: false,
      valueGetter: (value, row: MonitoringPoint) => row.machine?.name || '-',
      renderHeader: () => (
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          Machine
        </Typography>
      ),
    },
    {
      field: 'machineType',
      headerName: 'Machine Type',
      flex: 1.5,
      minWidth: 150,
      sortable: false,
      valueGetter: (value, row: MonitoringPoint) => row.machine?.type || '-',
      renderHeader: () => (
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          Machine Type
        </Typography>
      ),
    },
    {
      field: 'model',
      headerName: 'Model',
      flex: 1,
      minWidth: 100,
      sortable: false,
      valueGetter: (value, row: MonitoringPoint) => row.sensor?.model || '-',
      renderCell: (params) => (
        <Chip 
          label={params.value === 'HF_Plus' ? 'HF+' : params.value} 
          size="small" 
          variant="outlined" 
          color="primary"
          sx={{ fontWeight: 600, backgroundColor: 'primary.main', minWidth: '4rem' }}
        />
      ),
      renderHeader: () => (
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          Model
        </Typography>
      ),
    },
    {
      field: 'acceleration',
      headerName: 'Acc (m/s²)',
      flex: 1,
      minWidth: 100,
      sortable: false,
      valueGetter: (value, row: MonitoringPoint) => row.sensor?.telemetry?.[0]?.accelerationValue ?? '-',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
            {typeof params.value === 'number' ? params.value.toFixed(2) : params.value}
          </Typography>
        </Box>
      ),
      renderHeader: () => (
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          Acc (m/s²)
        </Typography>
      ),
    },
    {
      field: 'velocity',
      headerName: 'Vel (mm/s)',
      flex: 1,
      minWidth: 100,
      sortable: false,
      valueGetter: (value, row: MonitoringPoint) => row.sensor?.telemetry?.[0]?.velocityValue ?? '-',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: 'secondary.main' }}>
            {typeof params.value === 'number' ? params.value.toFixed(2) : params.value}
          </Typography>
        </Box>
      ),
      renderHeader: () => (
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          Vel (mm/s)
        </Typography>
      ),
    },
    {
      field: 'temperature',
      headerName: 'Temp (°C)',
      flex: 1,
      minWidth: 100,
      sortable: false,
      valueGetter: (value, row: MonitoringPoint) => row.sensor?.telemetry?.[0]?.temperatureValue ?? '-',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: 'error.main' }}>
            {typeof params.value === 'number' ? params.value.toFixed(1) : params.value}
          </Typography>
        </Box>
      ),
      renderHeader: () => (
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          Temp (°C)
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      flex: 0.8,
      minWidth: 80,
      renderHeader: () => (
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          Actions
        </Typography>
      ),
      renderCell: (params) => {
        const isDeleteDisabled = (params.row.machine._count?.monitoringPoints ?? 0) <= 2;
        
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', gap: 1 }}>
            <Tooltip title={isDeleteDisabled ? "Cannot delete: machine must have at least 2 points" : "Delete Monitoring Point"}>
              <span>
                <IconButton 
                  size="small" 
                  color="error" 
                  onClick={() => handleDeleteClick(params.row)}
                  disabled={isDeleteDisabled}
                  sx={{ 
                    bgcolor: isDeleteDisabled ? 'neutral.lighter' : 'error.lighter',
                    '&:hover': { bgcolor: isDeleteDisabled ? 'neutral.lighter' : 'error.light' }
                  }}
                >
                  <IconifyIcon icon="tabler:trash" width={18} />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        );
      },
    },
  ], []);

  return (
    <Box sx={{ height: 600, width: '100%', bgcolor: 'background.paper', borderRadius: 2, p: 2, boxShadow: 1 }}>
      <DataGrid
        rows={monitoringPoints}
        columns={columns}
        loading={loading}
        pagination
        paginationMode="server"
        rowCount={total}
        disableColumnResize
        disableColumnMenu
        disableColumnSelector
        disableRowSelectionOnClick
        pageSizeOptions={[5]}
        paginationModel={{ page: page - 1, pageSize: 5 }}
        onPaginationModelChange={(model) => onPaginationChange(model.page + 1)}
        sortingMode="server"
        sortModel={sortBy ? [{ field: sortBy, sort: sortOrder }] : []}
        onSortModelChange={(model) => {
          if (model.length > 0) {
            onSortChange(model[0].field, model[0].sort as 'asc' | 'desc');
          }
        }}
        sx={{
          border: 'none',
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: 'neutral.lighter',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid',
            borderColor: 'neutral.light',
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: 'none',
          }
        }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        PaperProps={{
          sx: { borderRadius: 3, p: 1 }
        }}
      >
        <DialogTitle id="delete-dialog-title" sx={{ fontWeight: 700, px: 3, pt: 2 }}>
          Delete Monitoring Point?
        </DialogTitle>
        <DialogContent sx={{ px: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}
          <DialogContentText id="delete-dialog-description" sx={{ color: 'text.primary' }}>
            Are you sure you want to delete <strong>{pointToDelete?.name}</strong>? 
            This action cannot be undone and will also remove its associated sensor data.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
          <Button 
            onClick={handleDeleteCancel} 
            color="inherit" 
            disabled={isDeleting}
            sx={{ fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            autoFocus
            disabled={isDeleting || !!error}
            startIcon={isDeleting ? <CircularProgress size={20} color="inherit" /> : <IconifyIcon icon="tabler:trash" />}
            sx={{ 
              fontWeight: 700,
              bgcolor: 'error.main',
              '&:hover': { bgcolor: 'error.dark' }
            }}
          >
            {isDeleting ? 'Deleting...' : 'Delete Point'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MonitoringPointsTable;
