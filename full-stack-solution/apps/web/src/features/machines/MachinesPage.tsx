import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import AddIcon from "@mui/icons-material/Add";
import type {
  CreateMachineInput,
  CreateMonitoringPointInput,
  Machine,
} from "@full-stack-solution/shared";
import { MIN_MONITORING_POINTS_PER_MACHINE } from "@full-stack-solution/shared";
import { useAppDispatch, useAppSelector } from "@web/app/hooks";
import { ConfirmDialog } from "@web/components/common/ConfirmDialog";
import { EmptyState } from "@web/components/common/EmptyState";
import { ErrorAlert } from "@web/components/common/ErrorAlert";
import { PageHeader } from "@web/components/common/PageHeader";
import { notify } from "@web/features/notifications/notifications.slice";
import { MonitoringPointFormDialog } from "@web/features/monitoring-points/MonitoringPointFormDialog";
import { createMonitoringPoint } from "@web/features/monitoring-points/monitoring-points.slice";
import { MachineFormDialog } from "./MachineFormDialog";
import { MachinesTable } from "./MachinesTable";
import {
  createMachine,
  deleteMachine,
  fetchMachines,
  machinesErrorDismissed,
  selectMachinesBelowMinimumPoints,
  updateMachine,
} from "./machines.slice";

/** Machine management: create, edit, delete and seed monitoring points. */
export function MachinesPage() {
  const dispatch = useAppDispatch();
  const { items, status, isMutating, error } = useAppSelector(
    (state) => state.machines,
  );
  const belowMinimum = useAppSelector(selectMachinesBelowMinimumPoints);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Machine | null>(null);
  const [deleting, setDeleting] = useState<Machine | null>(null);
  const [pointTarget, setPointTarget] = useState<Machine | null>(null);

  useEffect(() => {
    if (status === "idle") {
      void dispatch(fetchMachines());
    }
  }, [dispatch, status]);

  const handleSubmit = async (values: CreateMachineInput) => {
    // Dispatched in separate branches so each thunk keeps its own argument type.
    const result = editing
      ? await dispatch(updateMachine({ id: editing.id, changes: values }))
      : await dispatch(createMachine(values));

    if (result.meta.requestStatus === "fulfilled") {
      setFormOpen(false);
      setEditing(null);
      dispatch(notify(editing ? "Machine updated" : "Machine created"));
    }
  };

  const handleDelete = async () => {
    if (!deleting) {
      return;
    }

    const result = await dispatch(deleteMachine(deleting.id));

    if (result.meta.requestStatus === "fulfilled") {
      setDeleting(null);
      dispatch(notify("Machine deleted"));
    }
  };

  const handleCreatePoint = async (values: CreateMonitoringPointInput) => {
    if (!pointTarget) {
      return;
    }

    const result = await dispatch(
      createMonitoringPoint({ machineId: pointTarget.id, input: values }),
    );

    if (result.meta.requestStatus === "fulfilled") {
      setPointTarget(null);
      dispatch(notify("Monitoring point created"));
    }
  };

  return (
    <Stack spacing={3}>
      <PageHeader
        title="Machines"
        description="Register the assets you want to monitor."
        action={
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            Add machine
          </Button>
        }
      />

      {status === "failed" ? (
        <ErrorAlert
          error={error}
          onDismiss={() => dispatch(machinesErrorDismissed())}
          onRetry={() => void dispatch(fetchMachines())}
        />
      ) : null}

      {belowMinimum.length ? (
        <Alert severity="warning">
          <AlertTitle>Monitoring points below the recommended minimum</AlertTitle>
          {belowMinimum.map((machine) => machine.name).join(", ")} — each machine
          should have at least {MIN_MONITORING_POINTS_PER_MACHINE} monitoring
          points.
        </Alert>
      ) : null}

      <Card>
        {status === "loading" || isMutating ? <LinearProgress /> : null}
        {status === "succeeded" && items.length === 0 ? (
          <EmptyState
            title="No machines yet"
            description="Create your first machine to start monitoring it."
            action={
              <Button
                startIcon={<AddIcon />}
                onClick={() => {
                  setEditing(null);
                  setFormOpen(true);
                }}
                variant="contained"
              >
                Add machine
              </Button>
            }
          />
        ) : (
          // Horizontal scroll keeps the table usable on narrow screens.
          <Box sx={{ overflowX: "auto" }}>
            <MachinesTable
              machines={items}
              onEdit={(machine) => {
                setEditing(machine);
                setFormOpen(true);
              }}
              onDelete={setDeleting}
              onAddMonitoringPoint={setPointTarget}
            />
          </Box>
        )}
      </Card>

      <MachineFormDialog
        open={formOpen}
        machine={editing}
        busy={isMutating}
        error={formOpen ? error : null}
        onSubmit={handleSubmit}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
          dispatch(machinesErrorDismissed());
        }}
      />

      <MonitoringPointFormDialog
        open={Boolean(pointTarget)}
        machineName={pointTarget?.name}
        onSubmit={handleCreatePoint}
        onClose={() => setPointTarget(null)}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete machine"
        message={
          <>
            Deleting <strong>{deleting?.name}</strong> also removes its
            monitoring points, sensors and stored readings. This cannot be
            undone.
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
