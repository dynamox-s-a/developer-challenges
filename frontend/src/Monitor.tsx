import { Box, Button, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import {
  useGetAllMonitorPointsQuery,
  useGetMachinesQuery,
} from './features/monitor/monitorSlice';
import useAuth from './useAuth';

export default function Monitor() {
  const n = useNavigate();

  const authContext = useAuth();
  const { data: monitorData } = useGetAllMonitorPointsQuery(
    authContext!.user.id
  );
  const { data: machinesData } = useGetMachinesQuery(authContext!.user.id);

  const rows: Row[] =
    monitorData?.map((d) => ({
      id: d.id,
      machine: `${machinesData?.find((m) => m.id === d.machineId)?.name}`,
      type: `${machinesData?.find((m) => m.id === d.machineId)?.type}`,
      sensor: d.name,
      model: d.type,
    })) || [];
  const showRows = rows.length > 0;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        gap: '2rem',
      }}
    >
      <Typography component="h1" variant="h5">
        Monitoring Points
      </Typography>

      {!showRows && (
        <p>0 points to show. Try do add some machines and sensors.</p>
      )}

      {showRows && (
        <DataGrid
          sx={{ width: '100%' }}
          rows={rows}
          columns={columns}
          pageSizeOptions={[5]}
          paginationMode="client"
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 5 } },
          }}
        />
      )}
    </Box>
  );
}

type GridColDef = { field: string; headerName: string; width: number };
type Row = {
  machine: string;
  type: string;
  sensor: string;
  model: string;
};

const columns: GridColDef[] = [
  { field: 'machine', headerName: 'Machine Name', width: 300 },
  { field: 'type', headerName: 'Machine Type', width: 150 },
  { field: 'sensor', headerName: 'Monitoring Point Name', width: 300 },
  { field: 'model', headerName: 'Sensor Model', width: 150 },
];
