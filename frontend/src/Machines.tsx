import { DataGrid } from '@mui/x-data-grid';
import { Box, Container, Typography } from '@mui/material';
import { useGetMachinesQuery } from './features/monitor/monitorSlice';
import { MachineType } from './MachineCard';
import CreateMachine from './CreateMachine';
import UserCard from './components/UserCard';
import useAuth from './useAuth';

type GridColDef = { field: string; headerName: string; width: number };

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Machine Name', width: 150 },
  { field: 'type', headerName: 'Machine Type', width: 150 },
];

export default function Machines() {
  const authContext = useAuth();
  const { data } = useGetMachinesQuery(authContext!.user.id);

  const rows: MachineType[] = data || [];

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: '1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Machines
        </Typography>
        <DataGrid
          onCellClick={(e) => {
            console.log(e);
          }}
          rows={rows}
          columns={columns}
          pageSizeOptions={[5]}
          paginationMode="client"
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 5 } },
          }}
        />
      </Box>
      <CreateMachine />
      <UserCard />
    </Container>
  );
}
