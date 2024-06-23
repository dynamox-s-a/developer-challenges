import { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { Add, Create } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';
import {
  useDeleteMachineMutation,
  useGetMachinesQuery,
} from './features/monitor/monitorSlice';
import UserCard from './components/UserCard';
import useAuth from './useAuth';
import MyCopyright from './components/MyCopyright';

type GridColDef = { field: string; headerName: string; width: number };

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Machine Name', width: 150 },
  { field: 'type', headerName: 'Machine Type', width: 150 },
];

export default function Machines() {
  const authContext = useAuth();
  const n = useNavigate();
  const [deleteMachine] = useDeleteMachineMutation();
  const [sel, setSel] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const { data, refetch } = useGetMachinesQuery(authContext!.user.id);
  const rows: MachineType[] = data || [];

  const handleDelete = () => {
    setShowConfirmDelete(false);
    setSel(null);
    deleteMachine(`${sel}`)
      .unwrap()
      .then(() => {
        refetch();
      })
      .catch((error) => {
        alert(`Error trying to delete a machine. Please try again later...`);
        console.log(error);
        refetch();
      });
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexGrow: 1,
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'space-between',
          paddingTop: '2rem',
        }}
      >
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
            Machines
          </Typography>
          <DataGrid
            sx={{ width: '100%' }}
            onCellClick={(e) => {
              setSel(`${e.id}`);
            }}
            rows={rows}
            columns={columns}
            pageSizeOptions={[5]}
            paginationMode="client"
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize: 5 } },
            }}
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => n('/create-machine')}
            >
              Add
            </Button>
            <Button
              variant="outlined"
              startIcon={<Create />}
              disabled={sel == null}
              onClick={() => n(`/edit-machine/${sel}`)}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              startIcon={<DeleteIcon />}
              disabled={sel == null}
              onClick={() => setShowConfirmDelete(true)}
            >
              Delete
            </Button>
            <Dialog
              sx={{ textAlign: 'center' }}
              open={showConfirmDelete}
              onClose={() => setShowConfirmDelete(false)}
            >
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogContentText>
                Are you sure you want to delete this machine?
              </DialogContentText>
              <DialogActions>
                <Button onClick={() => setShowConfirmDelete(false)}>
                  Cancel
                </Button>
                <Button onClick={handleDelete} autoFocus>
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
          <Box width={'100%'}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => n(`/sensors/${sel}`)}
              disabled={!sel}
            >
              Sensors
            </Button>
          </Box>
        </Box>
        <UserCard />
        <MyCopyright />
      </Box>
    </Container>
  );
}

export type MachineType = {
  id: string;
  userId: string;
  name: string;
  type: string;
};
