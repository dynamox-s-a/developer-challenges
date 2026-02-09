import { useMemo } from 'react';
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';
import { Typography, Box, IconButton, Tooltip } from '@mui/material';
import { TelemetryRegistry } from 'store/slices/telemetrySlice';
import IconifyIcon from 'components/base/IconifyIcon';

interface TelemetryTableProps {
  telemetry: TelemetryRegistry[];
  loading: boolean;
  total: number;
  onPaginationChange: (page: number) => void;
  onDelete: (id: number) => void;
  page: number;
  sortModel: GridSortModel;
  onSortModelChange: (model: GridSortModel) => void;
  selectionModel: any[];
  onSelectionModelChange: (newSelectionModel: any[]) => void;
}

const TelemetryTable = ({
  telemetry,
  loading,
  total,
  onPaginationChange,
  onDelete,
  page,
  sortModel,
  onSortModelChange,
  selectionModel,
  onSelectionModelChange
}: TelemetryTableProps) => {

  const columns: GridColDef<TelemetryRegistry>[] = useMemo(() => [
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
      field: 'sensorId',
      headerName: 'Sensor ID',
      flex: 1.5,
      minWidth: 100,
      renderHeader: () => (
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          Sensor ID
        </Typography>
      ),
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={600}>
          {params.value && params.value.length > 13
            ? `${params.value.substring(0, 13)}...`
            : params.value}
        </Typography>
      ),
    },
    {
      field: 'sensorName',
      headerName: 'Sensor Name',
      flex: 1.5,
      minWidth: 150,
      valueGetter: (value, row: TelemetryRegistry) => row.sensor?.monitoringPoint?.name || '-',
      renderHeader: () => (
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          Sensor Name
        </Typography>
      ),
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={600} color="secondary.main">
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'accelerationValue',
      headerName: 'Acceleration',
      flex: 1,
      minWidth: 100,
      renderHeader: () => (
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          Acceleration
        </Typography>
      ),
      renderCell: (params) => (
        <Typography variant="body2" color="primary.main" fontWeight={700}>
          {params.value?.toFixed(2)}
        </Typography>
      ),
    },
    {
      field: 'velocityValue',
      headerName: 'Velocity',
      flex: 1,
      minWidth: 100,
      renderHeader: () => (
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          Velocity
        </Typography>
      ),
      renderCell: (params) => (
        <Typography variant="body2" color="primary.main" fontWeight={700}>
          {params.value?.toFixed(2)}
        </Typography>
      ),
    },
    {
      field: 'temperatureValue',
      headerName: 'Temperature',
      flex: 1,
      minWidth: 100,
      renderHeader: () => (
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          Temperature
        </Typography>
      ),
      renderCell: (params) => (
        <Typography variant="body2" color="primary.main" fontWeight={700}>
          {params.value?.toFixed(2)}
        </Typography>
      ),
    },
    {
      field: 'timestamp',
      headerName: 'Timestamp',
      flex: 1.5,
      minWidth: 200,
      renderHeader: () => (
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          Timestamp
        </Typography>
      ),
      renderCell: (params) => (
        <Typography variant="body2">
          {new Date(params.value).toLocaleString()}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.5,
      minWidth: 60,
      sortable: false,
      renderHeader: () => (
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          Actions
        </Typography>
      ),
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Tooltip title="Delete Registry">
            <IconButton 
              color="error" 
              onClick={() => onDelete(params.row.id)}
              size="small"
            >
              <IconifyIcon icon="tabler:trash" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ], [onDelete]);

  return (
    <Box sx={{ height: 600, width: '100%', bgcolor: 'background.paper', borderRadius: 2, p: 2, boxShadow: 1 }}>
      <DataGrid
        rows={telemetry}
        columns={columns}
        loading={loading}
        pagination
        paginationMode="server"
        rowCount={total}
        disableColumnResize
        disableColumnMenu
        disableColumnSelector
        onPaginationModelChange={(model) => onPaginationChange(model.page + 1)}
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={onSortModelChange}
        rowSelectionModel={selectionModel}
        onRowSelectionModelChange={(newSelectionModel) => onSelectionModelChange(newSelectionModel as any[])}
        checkboxSelection
        disableRowSelectionOnClick
        pageSizeOptions={[10]}
        paginationModel={{ page: page - 1, pageSize: 10 }}
        slotProps={{
          pagination: {
            showFirstButton: true,
            showLastButton: true,
          },
        }}
        sx={{
          border: 'none',
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: 'neutral.lighter',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid',
            borderColor: 'neutral.light',
            alignItems: 'center',
            display: 'flex'
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: 'none',
          }
        }}
      />
    </Box>
  );
};

export default TelemetryTable;
