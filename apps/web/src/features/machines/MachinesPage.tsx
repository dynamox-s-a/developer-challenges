import type { Machine, MachineType } from "@dyn/contracts";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SensorsOutlinedIcon from "@mui/icons-material/SensorsOutlined";
import {
  Alert,
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { PageHeading } from "../../components/PageHeading";
import { RequestState } from "../../components/RequestState";
import { MonitoringPointDialog } from "../monitoring/MonitoringPointDialog";
import {
  clearMonitoringError,
  createMonitoringPoint,
  fetchMonitoringPoints,
} from "../monitoring/monitoringSlice";
import { MachineDialog } from "./MachineDialog";
import {
  clearMachineError,
  createMachine,
  deleteMachine,
  fetchMachines,
  updateMachine,
} from "./machinesSlice";

export function MachinesPage() {
  const dispatch = useAppDispatch();
  const machines = useAppSelector((state) => state.machines);
  const monitoring = useAppSelector((state) => state.monitoring);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Machine | null>(null);
  const [deleting, setDeleting] = useState<Machine | null>(null);
  const [pointMachine, setPointMachine] = useState<Machine | null>(null);

  useEffect(() => {
    if (machines.status === "idle") {
      void dispatch(fetchMachines());
    }
  }, [dispatch, machines.status]);

  function handleOpenCreate() {
    dispatch(clearMachineError());
    setEditing(null);
    setDialogOpen(true);
  }

  function handleOpenEdit(machine: Machine) {
    dispatch(clearMachineError());
    setEditing(machine);
    setDialogOpen(true);
  }

  function handleCloseMachineDialog() {
    dispatch(clearMachineError());
    setDialogOpen(false);
  }

  function handleOpenPoint(machine: Machine) {
    dispatch(clearMonitoringError());
    setPointMachine(machine);
  }

  function handleClosePointDialog() {
    dispatch(clearMonitoringError());
    setPointMachine(null);
  }

  function handleOpenDelete(machine: Machine) {
    dispatch(clearMachineError());
    setDeleting(machine);
  }

  function handleCancelDelete() {
    dispatch(clearMachineError());
    setDeleting(null);
  }

  function handleSave(input: { name: string; type: MachineType }) {
    const operation = editing
      ? dispatch(updateMachine({ id: editing.id, name: input.name, type: input.type }))
      : dispatch(createMachine(input));
    void operation
      .unwrap()
      .then(() => setDialogOpen(false))
      .catch(() => undefined);
  }

  function handleDelete() {
    if (!deleting) {
      return;
    }
    void dispatch(deleteMachine(deleting.id))
      .unwrap()
      .then(() => setDeleting(null))
      .catch(() => undefined);
  }

  function handleCreatePoint(name: string) {
    if (!pointMachine) {
      return;
    }
    void dispatch(createMonitoringPoint({ machineId: pointMachine.id, name }))
      .unwrap()
      .then(() => {
        setPointMachine(null);
        return dispatch(
          fetchMonitoringPoints({
            page: 1,
            sortBy: "monitoringPointName",
            sortOrder: "asc",
          })
        );
      })
      .catch(() => undefined);
  }

  const pending = machines.mutationStatus === "submitting";

  return (
    <Stack spacing={3}>
      <PageHeading
        action={
          <Button onClick={handleOpenCreate} startIcon={<AddIcon />} variant="contained">
            Add machine
          </Button>
        }
        description="Create equipment and add the points where vibration sensors are installed."
        title="Machines"
      />
      {machines.error || monitoring.error ? (
        <Alert severity="error">{machines.error ?? monitoring.error}</Alert>
      ) : null}
      <Paper variant="outlined">
        <RequestState
          emptyDescription="Add a pump or fan to start configuring monitoring points."
          emptyTitle="No machines yet"
          error={machines.error}
          isEmpty={machines.items.length === 0}
          onRetry={() => void dispatch(fetchMachines())}
          status={machines.status}
        >
          <TableContainer>
            <Table aria-label="Machines" sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {machines.items.map((machine) => (
                  <TableRow hover key={machine.id}>
                    <TableCell component="th" scope="row">
                      {machine.name}
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={machine.type === "Pump" ? "primary" : "secondary"}
                        label={machine.type}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box display="inline-flex">
                        <Tooltip title="Add monitoring point">
                          <IconButton
                            aria-label={`Add monitoring point to ${machine.name}`}
                            onClick={() => handleOpenPoint(machine)}
                          >
                            <SensorsOutlinedIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit machine">
                          <IconButton
                            aria-label={`Edit ${machine.name}`}
                            onClick={() => handleOpenEdit(machine)}
                          >
                            <EditOutlinedIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete machine">
                          <IconButton
                            aria-label={`Delete ${machine.name}`}
                            color="error"
                            onClick={() => handleOpenDelete(machine)}
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </RequestState>
      </Paper>
      <MachineDialog
        error={machines.error}
        machine={editing}
        onClose={handleCloseMachineDialog}
        onSubmit={handleSave}
        open={dialogOpen}
        pending={pending}
      />
      <MonitoringPointDialog
        error={monitoring.error}
        machine={pointMachine}
        onClose={handleClosePointDialog}
        onSubmit={handleCreatePoint}
        pending={monitoring.mutationStatus === "submitting"}
      />
      <ConfirmDialog
        description={
          deleting
            ? `Delete ${deleting.name} and all of its monitoring data? This cannot be undone.`
            : ""
        }
        error={machines.error}
        onCancel={handleCancelDelete}
        onConfirm={handleDelete}
        open={Boolean(deleting)}
        pending={pending}
        title="Delete machine?"
      />
    </Stack>
  );
}
