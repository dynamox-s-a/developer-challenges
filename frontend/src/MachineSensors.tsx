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
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { DataGrid, GridCellParams, GridTreeNode } from '@mui/x-data-grid';
import {
  useDeleteSensorMutation,
  useGetMachinesQuery,
  useGetSensorsByMachineIdQuery,
} from './features/monitor/monitorSlice';
import { SensorType } from './Sensors';
import useAuth from './useAuth';
import { useState } from 'react';

export default function MachineSensors() {
  const n = useNavigate();
  const location = useLocation();
  const machineId = location.pathname.split('/')[2];

  const [sel, setSel] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const [deleteSensor] = useDeleteSensorMutation();

  const authContext = useAuth();
  const { data: machineData, isLoading } = useGetMachinesQuery(
    authContext!.user.id
  );
  const { data: sensorsData, refetch: refetchSensors } =
    useGetSensorsByMachineIdQuery(machineId);

  const machine = machineData?.find((m) => m.id == machineId);

  // if machine id not exist
  if (!isLoading && !machine) {
    alert('Machine not found. Returning to Machine list.');
    return <Navigate to="/machines" />;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // const d = new FormData(e.currentTarget);
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Sensor Name', width: 150 },
    { field: 'type', headerName: 'Sensor Type', width: 150 },
  ];

  const rows: SensorType[] = sensorsData || [];

  const showRows = rows.length > 0;

  const handleCellClick = (
    e: GridCellParams<any, unknown, unknown, GridTreeNode>
  ) => setSel(`${e.id}`);

  return (
    <Container
      component={'main'}
      maxWidth="xl"
      sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <Box
        sx={{
          margin: '1rem 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flexGrow: 1,
        }}
      >
        <Box sx={{ display: 'flex', width: '100%' }}>
          <Button variant="outlined" onClick={() => n('/machines')}>
            Back
          </Button>
        </Box>

        <Typography component="h1" variant="h5">
          Sensors
        </Typography>

        <Typography>
          Machine: {machine?.name} | {machine?.type}
        </Typography>

        {!showRows && (
          <Box sx={{ margin: 'auto' }}>0 Sensors. Try to add some...</Box>
        )}
        {showRows && (
          <DataGrid
            sx={{ m: 0, p: 0, width: '100%' }}
            onCellClick={handleCellClick}
            rows={rows}
            columns={columns}
            pageSizeOptions={[5]}
            paginationMode="client"
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize: 5 } },
            }}
          />
        )}
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
            onClick={() => n(`/create-sensor/${machineId}`)}
          >
            Add
          </Button>
          <Button
            variant="outlined"
            startIcon={<Create />}
            disabled={!sel}
            // onClick={() => n(`/edit-machine/${sel}`)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            startIcon={<DeleteIcon />}
            disabled={!sel}
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
              Are you sure you want to delete this sensor?
            </DialogContentText>
            <DialogActions>
              <Button onClick={() => setShowConfirmDelete(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowConfirmDelete(false);
                  setSel(null);
                  deleteSensor(`${sel}`)
                    .unwrap()
                    .then(() => {
                      refetchSensors();
                    })
                    .catch((error) => {
                      alert(
                        'Error trying to delete a sensor. Please try again later...'
                      );
                      console.log(error);
                    });
                }}
                autoFocus
              >
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
      <Typography variant="caption">
        Sensors of machine: {`${machineId}`}
      </Typography>
    </Container>
  );
}

type GridColDef = { field: string; headerName: string; width: number };
