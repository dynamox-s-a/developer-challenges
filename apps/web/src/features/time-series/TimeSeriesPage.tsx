import type { Machine, MonitoringPoint, TimeSeriesSummary } from "@dyn/contracts";
import AddChartOutlinedIcon from "@mui/icons-material/AddchartOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { PageHeading } from "../../components/PageHeading";
import { RequestState } from "../../components/RequestState";
import { fetchMachines } from "../machines/machinesSlice";
import { fetchMonitoringPointDirectory } from "../monitoring/monitoringSlice";
import { TimeSeriesDetailDialog } from "./TimeSeriesDetailDialog";
import {
  clearTimeSeriesDetail,
  clearTimeSeriesError,
  deleteTimeSeries,
  fetchTimeSeries,
  fetchTimeSeriesDetail,
  uploadTimeSeries,
} from "./timeSeriesSlice";
import { UploadTimeSeriesDialog } from "./UploadTimeSeriesDialog";

const PAGE_SIZE = 20;

type RequestStatus = "idle" | "loading" | "ready" | "failed";

// Machines and their points are both needed to turn ids into names, so they load or fail as one.
function combineStatus(machines: RequestStatus, directory: RequestStatus): RequestStatus {
  if (machines === "failed" || directory === "failed") {
    return "failed";
  }
  return machines === "ready" && directory === "ready" ? "ready" : "loading";
}

export function TimeSeriesPage() {
  const dispatch = useAppDispatch();
  const timeSeries = useAppSelector((state) => state.timeSeries);
  const machines = useAppSelector((state) => state.machines);
  const { directory, directoryStatus, directoryError } = useAppSelector(
    (state) => state.monitoring
  );
  const [page, setPage] = useState(1);
  const [machineId, setMachineId] = useState("");
  const [monitoringPointId, setMonitoringPointId] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleting, setDeleting] = useState<TimeSeriesSummary | null>(null);

  // A point is filter enough: the API has no machine filter and a point owns at most one sensor.
  const filters = useMemo(
    () => (monitoringPointId ? { monitoringPointId } : {}),
    [monitoringPointId]
  );

  const load = useCallback(() => {
    void dispatch(fetchTimeSeries({ page, pageSize: PAGE_SIZE, ...filters }));
  }, [dispatch, filters, page]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (machines.status === "idle") {
      void dispatch(fetchMachines());
    }
  }, [dispatch, machines.status]);

  useEffect(() => {
    if (machines.status === "ready" && directoryStatus === "idle") {
      void dispatch(fetchMonitoringPointDirectory(machines.items.map((machine) => machine.id)));
    }
  }, [directoryStatus, dispatch, machines.items, machines.status]);

  const machinesById = useMemo(
    () => new Map<string, Machine>(machines.items.map((machine) => [machine.id, machine])),
    [machines.items]
  );
  const pointsById = useMemo(
    () => new Map<string, MonitoringPoint>(directory.map((point) => [point.id, point])),
    [directory]
  );
  const machinePoints = useMemo(
    () => directory.filter((point) => point.machineId === machineId),
    [directory, machineId]
  );
  const selectedPoint = monitoringPointId ? pointsById.get(monitoringPointId) : undefined;
  const referenceStatus = combineStatus(machines.status, directoryStatus);

  function reloadReferenceData() {
    void dispatch(fetchMachines())
      .unwrap()
      .then((items) => dispatch(fetchMonitoringPointDirectory(items.map((item) => item.id))))
      .catch(() => undefined);
  }

  function handleMachineChange(nextMachineId: string) {
    setMachineId(nextMachineId);
    setMonitoringPointId("");
    setPage(1);
  }

  function handlePointChange(nextPointId: string) {
    setMonitoringPointId(nextPointId);
    setPage(1);
  }

  function handleClearFilters() {
    setMachineId("");
    setMonitoringPointId("");
    setPage(1);
  }

  function handleUpload(input: Parameters<typeof uploadTimeSeries>[0]) {
    void dispatch(uploadTimeSeries(input))
      .unwrap()
      .then(() => {
        setUploadOpen(false);
        setPage(1);
        return dispatch(fetchTimeSeries({ page: 1, pageSize: PAGE_SIZE, ...filters }));
      })
      .catch(() => undefined);
  }

  function handleOpenUpload() {
    dispatch(clearTimeSeriesError());
    setUploadOpen(true);
  }

  function handleCloseUpload() {
    dispatch(clearTimeSeriesError());
    setUploadOpen(false);
  }

  function handleOpenDetail(id: string) {
    dispatch(clearTimeSeriesError());
    setDetailOpen(true);
    void dispatch(fetchTimeSeriesDetail(id));
  }

  function handleCloseDetail() {
    setDetailOpen(false);
    dispatch(clearTimeSeriesDetail());
    dispatch(clearTimeSeriesError());
  }

  function handleOpenDelete(series: TimeSeriesSummary) {
    dispatch(clearTimeSeriesError());
    setDeleting(series);
  }

  function handleCancelDelete() {
    dispatch(clearTimeSeriesError());
    setDeleting(null);
  }

  function handleDelete() {
    if (!deleting) {
      return;
    }
    const nextPage = items.length === 1 && page > 1 ? page - 1 : page;
    void dispatch(deleteTimeSeries(deleting.id))
      .unwrap()
      .then(() => {
        setDeleting(null);
        if (nextPage !== page) {
          setPage(nextPage);
          return;
        }
        void dispatch(fetchTimeSeries({ page, pageSize: PAGE_SIZE, ...filters }));
      })
      .catch(() => undefined);
  }

  const items = timeSeries.result?.items ?? [];
  const pending = timeSeries.mutationStatus === "submitting";

  return (
    <Stack spacing={3}>
      <PageHeading
        action={
          <Button
            disabled={referenceStatus !== "ready" || machines.items.length === 0}
            onClick={handleOpenUpload}
            startIcon={<AddChartOutlinedIcon />}
            variant="contained"
          >
            Upload CSV
          </Button>
        }
        description="Store vibration samples, inspect metrics, and visualize each full series."
        title="Time series"
      />
      {timeSeries.error && timeSeries.status !== "failed" ? (
        <Alert onClose={() => dispatch(clearTimeSeriesError())} severity="error">
          {timeSeries.error}
        </Alert>
      ) : null}
      <Paper sx={{ p: 2 }} variant="outlined">
        <RequestState
          emptyDescription="Register a machine with a sensor-equipped monitoring point before uploading series."
          emptyTitle="No machines registered yet"
          error={machines.error ?? directoryError}
          isEmpty={machines.items.length === 0}
          onRetry={reloadReferenceData}
          status={referenceStatus}
        >
          <Stack
            alignItems={{ sm: "flex-start" }}
            direction={{ xs: "column", lg: "row" }}
            spacing={2}
          >
            <FormControl sx={{ minWidth: 220 }}>
              <InputLabel id="filter-machine-label">Machine</InputLabel>
              <Select
                label="Machine"
                labelId="filter-machine-label"
                onChange={(event) => handleMachineChange(event.target.value)}
                value={machineId}
              >
                <MenuItem value="">All machines</MenuItem>
                {machines.items.map((machine) => (
                  <MenuItem key={machine.id} value={machine.id}>
                    {machine.name} ({machine.type})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl disabled={!machineId} sx={{ minWidth: 260 }}>
              <InputLabel id="filter-point-label">Monitoring point</InputLabel>
              <Select
                label="Monitoring point"
                labelId="filter-point-label"
                onChange={(event) => handlePointChange(event.target.value)}
                value={monitoringPointId}
              >
                <MenuItem value="">All monitoring points</MenuItem>
                {machinePoints.map((point) => (
                  <MenuItem key={point.id} value={point.id}>
                    {point.name}
                    {point.sensor ? ` — ${point.sensor.id}` : ""}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button disabled={!machineId} onClick={handleClearFilters}>
              Clear
            </Button>
            <Box flex={1} textAlign={{ lg: "right" }}>
              <Chip
                color="primary"
                label={`${(timeSeries.result?.total ?? 0).toLocaleString()} stored series`}
                variant="outlined"
              />
            </Box>
          </Stack>
          {machineId && machinePoints.length === 0 ? (
            <Typography color="text.secondary" mt={1} variant="body2">
              This machine has no monitoring point yet.
            </Typography>
          ) : null}
          {machineId && !monitoringPointId && machinePoints.length > 0 ? (
            <Typography color="text.secondary" mt={1} variant="body2">
              Pick a monitoring point to narrow the list.
            </Typography>
          ) : null}
          {selectedPoint ? (
            <Typography color="text.secondary" mt={1} variant="body2">
              {selectedPoint.sensor
                ? `Sensor ${selectedPoint.sensor.id} (${selectedPoint.sensor.model})`
                : "This monitoring point has no associated sensor."}
            </Typography>
          ) : null}
        </RequestState>
      </Paper>
      <Paper variant="outlined">
        <RequestState
          emptyDescription="Upload a timestamp,x,y,z CSV for a sensor-equipped monitoring point."
          emptyTitle="No time series found"
          error={timeSeries.error}
          isEmpty={items.length === 0}
          onRetry={load}
          status={timeSeries.status}
        >
          <TableContainer>
            <Table aria-label="Time series" sx={{ minWidth: 1080 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Label</TableCell>
                  <TableCell>Machine</TableCell>
                  <TableCell>Monitoring point</TableCell>
                  <TableCell>Sensor</TableCell>
                  <TableCell align="right">Samples</TableCell>
                  <TableCell>Range</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((series) => {
                  const point = pointsById.get(series.monitoringPointId);
                  const machine = point ? machinesById.get(point.machineId) : undefined;
                  return (
                    <TableRow hover key={series.id}>
                      <TableCell component="th" scope="row">
                        {series.label ?? "Unlabelled series"}
                      </TableCell>
                      <TableCell>
                        {machine ? (
                          <Stack spacing={0.25}>
                            <span>{machine.name}</span>
                            <Typography color="text.secondary" variant="caption">
                              {machine.type}
                            </Typography>
                          </Stack>
                        ) : (
                          "Unknown machine"
                        )}
                      </TableCell>
                      <TableCell>
                        <Tooltip title={series.monitoringPointId}>
                          <span>{point?.name ?? "Unknown monitoring point"}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.25}>
                          <span>{series.sensorId}</span>
                          {point?.sensor ? (
                            <Typography color="text.secondary" variant="caption">
                              {point.sensor.model}
                            </Typography>
                          ) : null}
                        </Stack>
                      </TableCell>
                      <TableCell align="right">{series.sampleCount.toLocaleString()}</TableCell>
                      <TableCell>
                        {new Date(series.startedAt).toLocaleString()} –{" "}
                        {new Date(series.endedAt).toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="View metrics and chart">
                          <IconButton
                            aria-label={`View ${series.label ?? series.id}`}
                            onClick={() => handleOpenDetail(series.id)}
                          >
                            <InsightsOutlinedIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete time series">
                          <IconButton
                            aria-label={`Delete ${series.label ?? series.id}`}
                            color="error"
                            onClick={() => handleOpenDelete(series)}
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={timeSeries.result?.total ?? 0}
            onPageChange={(_, nextPage) => setPage(nextPage + 1)}
            page={Math.max(0, page - 1)}
            rowsPerPage={PAGE_SIZE}
            rowsPerPageOptions={[PAGE_SIZE]}
          />
        </RequestState>
      </Paper>
      <UploadTimeSeriesDialog
        machines={machines.items}
        onClose={handleCloseUpload}
        onSubmit={handleUpload}
        open={uploadOpen}
        pending={pending}
        submitError={timeSeries.error}
      />
      <TimeSeriesDetailDialog onClose={handleCloseDetail} open={detailOpen} />
      <ConfirmDialog
        description="Delete this complete time series and all of its samples? This cannot be undone."
        error={timeSeries.error}
        onCancel={handleCancelDelete}
        onConfirm={handleDelete}
        open={Boolean(deleting)}
        pending={pending}
        title="Delete time series?"
      />
    </Stack>
  );
}
