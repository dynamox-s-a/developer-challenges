import {
  Box,
  Card,
  Divider,
  Skeleton,
  Typography,
  CardContent,
} from '@mui/material';
import useAppSelector from '../../hooks/useAppSelector';
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const columns: GridColDef[] = [
  { field: "id", headerName: "Sensor ID", width: 200 },
  { field: "model", headerName: "Model", width: 200 },
];

export const SensorsTable = () => {
  const {status, data: sensors} = useAppSelector(state => state.sensors);

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
            Your Sensors
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
              rows={sensors}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
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
    </Card>
  );
};
