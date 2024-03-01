import {
  Box,
  Card,
  Divider,
  Skeleton,
  Typography,
  CardContent,
} from '@mui/material';
import { Machine } from '@prisma/client';
import { EditMachineModal } from './EditMachineModal';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { selectMachine } from '../../lib/redux/features/machinesSlice';

const columns: GridColDef[] = [
  { field: "id", headerName: "Sensor ID", width: 200 },
  { field: "type", headerName: "Type", width: 200 },
  { field: "name", headerName: "Name", width: 200 },
];

export const MachinesTable = () => {
  const dispatch = useAppDispatch();
  const {status, data: machines, machineSelected} = useAppSelector(state => state.machines);

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <CardContent>
        <Box
          sx={{
            alignItems: 'start',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Typography
            gutterBottom
            variant="h5"
          >
            Your machines
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      {
        status === "loading" ? (
          <Box>
            <Skeleton height={50} width={"100%"} />
            <Skeleton height={50} width={"100%"} />
            <Skeleton height={50} width={"100%"} />
            <Skeleton height={50} width={"100%"} />
            <Skeleton height={50} width={"100%"} />
            <Skeleton height={50} width={"100%"} />
            <Skeleton height={50} width={"100%"} />
          </Box>
        ) : (
          <Box>
            <DataGrid
              autoHeight
              rows={machines}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              onRowClick={(row) => {
                dispatch(selectMachine(row.row as Machine));
              }}
              pageSizeOptions={[5, 10]}
            />
          </Box>
        )
      }
      {
        status === "error" ? (
          <Box>
            <Typography
              color="textSecondary"
              variant="body2"
            >
              Something went wrong. Please try again later.
            </Typography>
          </Box>
        ) : null
      }
      { machineSelected && <EditMachineModal /> }
    </Card>
  );
};
