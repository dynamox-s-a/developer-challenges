import { useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { DataGrid, GridColDef, useGridApiRef, GridApi } from '@mui/x-data-grid';
import DataGridFooter from 'components/common/DataGridFooter';
import IconifyIcon from 'components/base/IconifyIcon';
import { rows } from 'data/complexTableData';
import ActionMenu from './ActionMenu';

const columns: GridColDef<(typeof rows)[number]>[] = [
  {
    field: '__check__',
    headerName: '',
    width: 52,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: 'id',
    headerName: 'ID',
    editable: false,
    align: 'left',
    flex: 2,
    minWidth: 130,
    renderHeader: () => (
      <Typography variant="body2" color="text.disabled" fontWeight={500} ml={1}>
        ID
      </Typography>
    ),
    renderCell: (params) => (
      <Stack ml={1} height={1} direction="column" alignSelf="center" justifyContent="center">
        <Typography variant="body2" fontWeight={600}>
          {params.value}
        </Typography>
      </Stack>
    ),
  },
  {
    field: 'name',
    headerName: 'NAME',
    editable: false,
    align: 'left',
    flex: 2,
    minWidth: 190,
  },
  {
    field: 'status',
    headerName: 'STATUS',
    headerAlign: 'left',
    editable: false,
    flex: 1,
    minWidth: 160,
    renderCell: (params) => {
      const status = params.value.toLowerCase();
      let color = '';
      let icon = '';

      if (status === 'approved') {
        color = 'success.main';
        icon = 'ic:baseline-check-circle';
      } else if (status === 'error') {
        color = 'warning.main';
        icon = 'ic:baseline-error';
      } else if (status === 'disable') {
        color = 'error.main';
        icon = 'ic:baseline-cancel';
      }

      return (
        <Stack alignItems="center" spacing={0.8} height={1}>
          <IconifyIcon icon={icon} color={color} fontSize="h5.fontSize" />
          <Typography variant="body2" fontWeight={600}>
            {params.value}
          </Typography>
        </Stack>
      );
    },
  },
  {
    field: 'date',
    headerName: 'DATE',
    editable: false,
    align: 'left',
    flex: 2,
    minWidth: 150,
  },
  {
    field: 'progress',
    headerName: 'EFFICIENCY',
    editable: false,
    align: 'left',
    flex: 2,
    minWidth: 220,
    renderCell: (params) => {
      return (
        <Stack alignItems="center" pr={5} height={1} width={1}>
          <Typography variant="body2" fontWeight={600} minWidth={40}>
            {params.value}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={params.value}
            sx={{
              width: 1,
              height: 6,
              borderRadius: 10,
              bgcolor: 'neutral.dark',
              '& .MuiLinearProgress-bar': {
                borderRadius: 10,
              },
            }}
          />
        </Stack>
      );
    },
  },
  {
    field: 'quantity',
    headerName: 'READINGS',
    editable: false,
    align: 'left',
    flex: 2,
    minWidth: 100,
  },
  {
    field: 'balance',
    headerName: 'CONDITION',
    headerAlign: 'right',
    align: 'right',
    editable: false,
    flex: 1,
    minWidth: 100,
  },
  {
    field: 'action',
    headerAlign: 'right',
    align: 'right',
    editable: false,
    sortable: false,
    flex: 1,
    minWidth: 100,
    renderHeader: () => <ActionMenu />,
    renderCell: () => <ActionMenu />,
  },
];

interface TaskOverviewTableProps {
  searchText: string;
}

const DataTable = ({ searchText }: TaskOverviewTableProps) => {
  const apiRef = useGridApiRef<GridApi>();

  useEffect(() => {
    apiRef.current.setQuickFilterValues(searchText.split(/\b\W+\b/).filter((word) => word !== ''));
  }, [searchText]);

  return (
    <DataGrid
      apiRef={apiRef}
      density="standard"
      columns={columns}
      rows={rows}
      rowHeight={52}
      disableColumnResize
      disableColumnMenu
      disableColumnSelector
      disableRowSelectionOnClick
      initialState={{
        pagination: { paginationModel: { pageSize: 4 } },
      }}
      autosizeOptions={{
        includeOutliers: true,
        includeHeaders: false,
        outliersFactor: 1,
        expand: true,
      }}
      slots={{
        pagination: DataGridFooter,
      }}
      checkboxSelection
      pageSizeOptions={[4]}
    />
  );
};

export default DataTable;
