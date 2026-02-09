import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store/store';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DataGrid, GridColDef, useGridApiRef, GridApi } from '@mui/x-data-grid';
import DataGridFooter from 'components/common/DataGridFooter';
import MachineActionMenu from './MachineActionMenu';
import { Machine } from 'store/slices/machinesSlice';
import { Box, Container } from '@mui/material';

interface MachinesTableProps {
  searchText: string;
  onEdit: (machine: Machine) => void;
}

const TableNoRowsOverlay = () => (
  <Container sx={{ display: 'grid', placeItems: 'center',height: '100%' }}>
    <Typography sx={{ width: 'fit-content', color: 'text.secondary' }}>No machines found</Typography>
  </Container>
)

const MachinesTable = ({ searchText, onEdit }: MachinesTableProps) => {
  const apiRef = useGridApiRef<GridApi>();
  const { items, status } = useSelector((state: RootState) => state.machines);

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'id',
        headerName: 'ID',
        editable: false,
        align: 'left',
        flex: 1,
        minWidth: 100,
        renderHeader: () => (
          <Typography variant="body2" color="text.secondary" fontWeight={500} ml={1} bgcolor={'transparent'}>
            ID
          </Typography>
        ),
        renderCell: (params) => (
          <Stack
            ml={1}
            height={1}
            width={'min-content'}
            direction="column"
            alignSelf="center"
            justifyContent="center"
          >
            <Typography variant="body2" fontWeight={600}>
              {params.value}
            </Typography>
          </Stack>
        ),
      },
      {
        field: 'name',
        headerName: 'Name',
        editable: false,
        align: 'left',
        flex: 2,
        minWidth: 180,
        renderHeader: () => (
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            Name
          </Typography>
        ),
      },
      {
        field: 'monitoringPointsCount',
        headerName: 'Monitoring points',
        editable: false,
        headerAlign: 'center',
        align: 'center',
        flex: 1,
        minWidth: 80,
        renderHeader: () => (
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            Monitoring points
          </Typography>
        ),
      },
      {
        field: 'Action',
        headerName: '',
        headerAlign: 'right',
        align: 'right',
        editable: false,
        sortable: false,
        flex: 1,
        minWidth: 80,
        renderCell: (params) => (
          <MachineActionMenu machine={params.row as Machine} onEdit={onEdit} />
        ),
      },
    ],
    [onEdit],
  );

  const rows = useMemo(() => {
    return items.map((machine) => ({
      ...machine,
      monitoringPointsCount: machine.monitoringPoints?.length || 0,
      velocity: null, // No telemetry in machines list for now
      acceleration: null,
      temperature: null,
    }));
  }, [items]);

  useEffect(() => {
    apiRef.current.setQuickFilterValues(searchText.split(/\b\W+\b/).filter((word) => word !== ''));
  }, [searchText]);

  return (
    <DataGrid
      apiRef={apiRef}
      loading={status === 'loading'}
      density="standard"
      columns={columns}
      sx={{ '& .MuiDataGrid-columnHeader ': { backgroundColor: 'neutral.lighter' } }}
      rows={rows}
      rowHeight={52}
      disableColumnResize
      disableColumnMenu
      disableColumnSelector
      disableRowSelectionOnClick
      initialState={{
        pagination: { paginationModel: { pageSize: 10 } },
      }}
      autosizeOptions={{
        includeOutliers: true,
        includeHeaders: false,
        outliersFactor: 1,
        expand: true,
      }}
      slots={{
        pagination: DataGridFooter,
        noRowsOverlay: TableNoRowsOverlay,
      }}
      pageSizeOptions={[10, 20]}
    />
  );
};

export default MachinesTable;
