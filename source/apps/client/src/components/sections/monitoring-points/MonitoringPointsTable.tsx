import { useMemo } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Typography, Box, Chip } from '@mui/material';
import { MonitoringPoint } from 'store/slices/monitoringPointsSlice';

interface MonitoringPointsTableProps {
  monitoringPoints: MonitoringPoint[];
  loading: boolean;
  total: number;
  onPaginationChange: (page: number) => void;
  page: number;
}

const MonitoringPointsTable = ({ 
  monitoringPoints, 
  loading, 
  total, 
  onPaginationChange, 
  page 
}: MonitoringPointsTableProps) => {

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
    </Box>
  );
};

export default MonitoringPointsTable;
