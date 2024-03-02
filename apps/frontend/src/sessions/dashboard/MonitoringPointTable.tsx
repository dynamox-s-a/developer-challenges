import {
  Box,
  Card,
  Divider,
  Skeleton,
  Typography,
  CardContent,
} from '@mui/material';
import { MonitoringPoint } from '@prisma/client';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { EditMonitoringPointModal } from './EditMonitoringPointModal';
import { selectMonitoringPoint } from '../../lib/redux/features/monitoringPointsSlice';

const columns: GridColDef[] = [
  { field: "name", headerName: "Monitoring Point", width: 200 },
  { field: "machineName", headerName: "Machine Name", width: 200 },
  { field: "machineType", headerName: "Machine Type", width: 200 },
  { field: "sensor", headerName: "Sensor", width: 200 },
];

export const MonitoringPointTable = () => {
  const dispatch = useAppDispatch();
  const {
    status,
    data: monitoringPoint,
    monitoringPointSelected: mpSelected
  } = useAppSelector(state => state.monitoringPoints);
  const { data: sensors } = useAppSelector(state => state.sensors);
  const { data: machines } = useAppSelector(state => state.machines);

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
            Your monitoring points
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
              rows={monitoringPoint}
              columns={
                columns.map((column) => {
                  if (column.field === "sensor") {
                    return {
                      ...column,
                      valueGetter: (params) => {
                        const sensor = sensors.find((sensor) => sensor.id === (params.row as unknown as MonitoringPoint).sensorId);
                        return sensor?.model;
                      }
                    };
                  } else if (column.field === "machineType") {
                    return {
                      ...column,
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      valueGetter: (params: any) => {
                        const machine = machines.find((machine) => machine.id === (params.row as unknown as MonitoringPoint).machineId);
                        return machine?.type;
                      }
                    };
                  } else if (column.field === "machineName") {
                    return {
                      ...column,
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      valueGetter: (params: any) => {
                        const machine = machines.find((machine) => machine.id === (params.row as unknown as MonitoringPoint).machineId);
                        return machine?.name;
                      }
                    };
                  }
                  return column;
                })
              }
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              onRowClick={(row) => {
                dispatch(selectMonitoringPoint(row.row as MonitoringPoint));
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
      { mpSelected && <EditMonitoringPointModal /> }
    </Card>
  );
};
