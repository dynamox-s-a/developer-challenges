import type {
  MonitoringPointListItem,
  MonitoringPointSortBy,
  SensorModel,
  SortOrder,
} from "@dyn/contracts";
import { MONITORING_POINT_PAGE_SIZE } from "@dyn/contracts";
import SensorsOutlinedIcon from "@mui/icons-material/SensorsOutlined";
import {
  Alert,
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { PageHeading } from "../../components/PageHeading";
import { RequestState } from "../../components/RequestState";
import { attachSensor, clearMonitoringError, fetchMonitoringPoints } from "./monitoringSlice";
import { SensorDialog } from "./SensorDialog";

const columns: Array<{ id: MonitoringPointSortBy; label: string }> = [
  { id: "machineName", label: "Machine name" },
  { id: "machineType", label: "Machine type" },
  { id: "monitoringPointName", label: "Monitoring point" },
  { id: "sensorModel", label: "Sensor model" },
];

export function MonitoringPointsPage() {
  const dispatch = useAppDispatch();
  const monitoring = useAppSelector((state) => state.monitoring);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<MonitoringPointSortBy>("monitoringPointName");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [selectedPoint, setSelectedPoint] = useState<MonitoringPointListItem | null>(null);

  const load = useCallback(() => {
    void dispatch(fetchMonitoringPoints({ page, sortBy, sortOrder }));
  }, [dispatch, page, sortBy, sortOrder]);

  useEffect(() => {
    load();
  }, [load]);

  function handleSort(column: MonitoringPointSortBy) {
    if (sortBy === column) {
      setSortOrder((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
    setPage(1);
  }

  function handleAttachSensor(input: { sensorId: string; model: SensorModel }) {
    if (!selectedPoint) {
      return;
    }
    void dispatch(attachSensor({ monitoringPointId: selectedPoint.id, ...input }))
      .unwrap()
      .then(() => setSelectedPoint(null))
      .catch(() => undefined);
  }

  function handleOpenSensorDialog(point: MonitoringPointListItem) {
    dispatch(clearMonitoringError());
    setSelectedPoint(point);
  }

  function handleCloseSensorDialog() {
    dispatch(clearMonitoringError());
    setSelectedPoint(null);
  }

  const items = monitoring.result?.items ?? [];

  return (
    <Stack spacing={3}>
      <PageHeading
        description="Review every monitoring location, sort the list, and associate compatible sensors."
        title="Monitoring points"
      />
      {monitoring.error && monitoring.status !== "failed" ? (
        <Alert onClose={() => dispatch(clearMonitoringError())} severity="error">
          {monitoring.error}
        </Alert>
      ) : null}
      <Paper variant="outlined">
        <RequestState
          emptyDescription="Add monitoring points from a machine before associating sensors."
          emptyTitle="No monitoring points yet"
          error={monitoring.error}
          isEmpty={items.length === 0}
          onRetry={load}
          status={monitoring.status}
        >
          <TableContainer>
            <Table aria-label="Monitoring points" sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      sortDirection={sortBy === column.id ? sortOrder : false}
                    >
                      <TableSortLabel
                        active={sortBy === column.id}
                        direction={sortBy === column.id ? sortOrder : "asc"}
                        onClick={() => handleSort(column.id)}
                      >
                        {column.label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                  <TableCell>Sensor ID</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((point) => (
                  <TableRow hover key={point.id}>
                    <TableCell>{point.machineName}</TableCell>
                    <TableCell>
                      <Chip label={point.machineType} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {point.monitoringPointName}
                    </TableCell>
                    <TableCell>{point.sensorModel ?? "Not associated"}</TableCell>
                    <TableCell>{point.sensorId ?? "—"}</TableCell>
                    <TableCell align="right">
                      <Button
                        aria-label={
                          point.sensorId
                            ? `Sensor associated with ${point.monitoringPointName} on ${point.machineName}`
                            : `Associate sensor with ${point.monitoringPointName} on ${point.machineName}`
                        }
                        disabled={Boolean(point.sensorId)}
                        onClick={() => handleOpenSensorDialog(point)}
                        size="small"
                        startIcon={<SensorsOutlinedIcon />}
                        variant="outlined"
                      >
                        {point.sensorId ? "Associated" : "Associate"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={monitoring.result?.total ?? 0}
            onPageChange={(_, nextPage) => setPage(nextPage + 1)}
            page={Math.max(0, page - 1)}
            rowsPerPage={MONITORING_POINT_PAGE_SIZE}
            rowsPerPageOptions={[MONITORING_POINT_PAGE_SIZE]}
          />
        </RequestState>
      </Paper>
      <SensorDialog
        error={monitoring.error}
        onClose={handleCloseSensorDialog}
        onSubmit={handleAttachSensor}
        pending={monitoring.mutationStatus === "submitting"}
        point={selectedPoint}
      />
    </Stack>
  );
}
