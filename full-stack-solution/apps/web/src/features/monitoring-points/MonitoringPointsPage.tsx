import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import TablePagination from "@mui/material/TablePagination";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import type {
  AssignSensorInput,
  CreateMonitoringPointInput,
  MonitoringPoint,
} from "@full-stack-solution/shared";
import { MONITORING_POINTS_PAGE_SIZE } from "@full-stack-solution/shared";
import { useAppDispatch, useAppSelector } from "@web/app/hooks";
import { ConfirmDialog } from "@web/components/common/ConfirmDialog";
import { EmptyState } from "@web/components/common/EmptyState";
import { ErrorAlert } from "@web/components/common/ErrorAlert";
import { PageHeader } from "@web/components/common/PageHeader";
import { fetchMachines } from "@web/features/machines/machines.slice";
import { notify } from "@web/features/notifications/notifications.slice";
import { paths } from "@web/routes/paths";
import { CreateMonitoringPointDialog } from "./CreateMonitoringPointDialog";
import { MonitoringPointFormDialog } from "./MonitoringPointFormDialog";
import { MonitoringPointsTable } from "./MonitoringPointsTable";
import { SensorFormDialog } from "./SensorFormDialog";
import {
  assignSensor,
  deleteMonitoringPoint,
  fetchMonitoringPoints,
  monitoringPointsErrorDismissed,
  pageChanged,
  pageSizeChanged,
  removeSensor,
  renameMonitoringPoint,
  sortChanged,
} from "./monitoring-points.slice";

/**
 * Paginated, sortable monitoring points list with sensor management.
 *
 * The query (page, page size, sort field and direction) lives in Redux, so the
 * list reloads whenever any of it changes, in a single place.
 */
export function MonitoringPointsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, total, query, status, isMutating, error } = useAppSelector(
    (state) => state.monitoringPoints,
  );
  const machines = useAppSelector((state) => state.machines.items);

  const [creating, setCreating] = useState(false);
  const [renaming, setRenaming] = useState<MonitoringPoint | null>(null);
  const [sensorTarget, setSensorTarget] = useState<MonitoringPoint | null>(null);
  const [removingSensor, setRemovingSensor] = useState<MonitoringPoint | null>(
    null,
  );
  const [deleting, setDeleting] = useState<MonitoringPoint | null>(null);

  useEffect(() => {
    void dispatch(fetchMonitoringPoints());
  }, [dispatch, query.page, query.pageSize, query.sortBy, query.order]);

  useEffect(() => {
    void dispatch(fetchMachines());
  }, [dispatch]);

  const handleRename = async (values: CreateMonitoringPointInput) => {
    if (!renaming) {
      return;
    }

    const result = await dispatch(
      renameMonitoringPoint({ id: renaming.id, input: values }),
    );

    if (result.meta.requestStatus === "fulfilled") {
      setRenaming(null);
      dispatch(notify("Monitoring point renamed"));
    }
  };

  const handleAssignSensor = async (values: AssignSensorInput) => {
    if (!sensorTarget) {
      return;
    }

    const result = await dispatch(
      assignSensor({ monitoringPointId: sensorTarget.id, input: values }),
    );

    if (result.meta.requestStatus === "fulfilled") {
      setSensorTarget(null);
      dispatch(notify("Sensor assigned"));
    }
  };

  const handleRemoveSensor = async () => {
    if (!removingSensor) {
      return;
    }

    const result = await dispatch(removeSensor(removingSensor.id));

    if (result.meta.requestStatus === "fulfilled") {
      setRemovingSensor(null);
      dispatch(notify("Sensor removed"));
    }
  };

  const handleDelete = async () => {
    if (!deleting) {
      return;
    }

    const result = await dispatch(deleteMonitoringPoint(deleting.id));

    if (result.meta.requestStatus === "fulfilled") {
      setDeleting(null);
      dispatch(notify("Monitoring point deleted"));
    }
  };

  const hasMachines = machines.length > 0;

  return (
    <Stack spacing={3}>
      <PageHeader
        title="Monitoring points"
        description="Every monitoring point and the sensor attached to it."
        action={
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            disabled={!hasMachines}
            onClick={() => setCreating(true)}
          >
            Add monitoring point
          </Button>
        }
      />

      <ErrorAlert
        error={error}
        onDismiss={() => dispatch(monitoringPointsErrorDismissed())}
        onRetry={() => void dispatch(fetchMonitoringPoints())}
      />

      <Card>
        {status === "loading" || isMutating ? <LinearProgress /> : null}

        {status === "succeeded" && items.length === 0 ? (
          <EmptyState
            title="No monitoring points"
            description={
              hasMachines
                ? "Add a monitoring point to one of your machines."
                : "Create a machine first, then add monitoring points to it."
            }
            action={
              hasMachines ? (
                <Button variant="contained" onClick={() => setCreating(true)}>
                  Add monitoring point
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => navigate(paths.machines)}
                >
                  Go to machines
                </Button>
              )
            }
          />
        ) : (
          <>
            <Box sx={{ overflowX: "auto" }}>
              <MonitoringPointsTable
                monitoringPoints={items}
                sortBy={query.sortBy}
                order={query.order}
                onSort={(field) => dispatch(sortChanged(field))}
                onRename={setRenaming}
                onAssignSensor={setSensorTarget}
                onRemoveSensor={setRemovingSensor}
                onDelete={setDeleting}
              />
            </Box>
            <TablePagination
              component="div"
              count={total}
              // The API is 1-based, MUI is 0-based.
              page={query.page - 1}
              rowsPerPage={query.pageSize}
              rowsPerPageOptions={[MONITORING_POINTS_PAGE_SIZE, 10, 25]}
              onPageChange={(_event, page) => dispatch(pageChanged(page))}
              onRowsPerPageChange={(event) =>
                dispatch(pageSizeChanged(Number(event.target.value)))
              }
            />
          </>
        )}
      </Card>

      <CreateMonitoringPointDialog
        open={creating}
        onClose={() => setCreating(false)}
      />

      <MonitoringPointFormDialog
        open={Boolean(renaming)}
        initialName={renaming?.name ?? ""}
        busy={isMutating}
        error={renaming ? error : null}
        onSubmit={handleRename}
        onClose={() => setRenaming(null)}
      />

      <SensorFormDialog
        open={Boolean(sensorTarget)}
        monitoringPoint={sensorTarget}
        busy={isMutating}
        error={sensorTarget ? error : null}
        onSubmit={handleAssignSensor}
        onClose={() => {
          setSensorTarget(null);
          dispatch(monitoringPointsErrorDismissed());
        }}
      />

      <ConfirmDialog
        open={Boolean(removingSensor)}
        title="Remove sensor"
        message={
          <>
            The sensor <strong>{removingSensor?.sensorId}</strong> will be
            detached from <strong>{removingSensor?.name}</strong>.
          </>
        }
        confirmLabel="Remove"
        confirmColor="error"
        busy={isMutating}
        onConfirm={handleRemoveSensor}
        onClose={() => setRemovingSensor(null)}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete monitoring point"
        message={
          <>
            Deleting <strong>{deleting?.name}</strong> also removes its sensor
            and every reading stored for it.
          </>
        }
        confirmLabel="Delete"
        confirmColor="error"
        busy={isMutating}
        onConfirm={handleDelete}
        onClose={() => setDeleting(null)}
      />
    </Stack>
  );
}
