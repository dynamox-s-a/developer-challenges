import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addMachine, editMachine, loadMachines, removeMachine } from "../store/machinesSlice";
import type { Machine, MachineType } from "../api/machines";

type FormState = { id?: string; name: string; type: MachineType };

export default function MachinesPage() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((s: any) => s.machines);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>({ name: "", type: "Pump" });
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  useEffect(() => {
    dispatch(loadMachines());
  }, [dispatch]);

  const cols: GridColDef[] = useMemo(
    () => [
      { field: "name", headerName: "Name", flex: 1, minWidth: 200 },
      { field: "type", headerName: "Type", width: 120 },
      {
        field: "actions",
        headerName: "Actions",
        width: 220,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const row = params.row as Machine;
          return (
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                onClick={() => {
                  setForm({ id: row.id, name: row.name, type: row.type });
                  setOpen(true);
                }}
              >
                Edit
              </Button>
              <Button
                size="small"
                color="error"
                onClick={async () => {
                  if (!confirm(`Delete machine "${row.name}"?`)) return;
                  try {
                    await dispatch(removeMachine(row.id)).unwrap();
                    setToast({ type: "success", msg: "Machine deleted" });
                  } catch (e: any) {
                    setToast({ type: "error", msg: e?.message ?? "Failed to delete" });
                  }
                }}
              >
                Delete
              </Button>
            </Stack>
          );
        },
      },
    ],
    [dispatch]
  );

  async function onSave() {
    if (!form.name.trim()) {
      setToast({ type: "error", msg: "Name is required" });
      return;
    }

    try {
      if (form.id) {
        await dispatch(editMachine({ id: form.id, name: form.name, type: form.type })).unwrap();
        setToast({ type: "success", msg: "Machine updated" });
      } else {
        await dispatch(addMachine({ name: form.name, type: form.type })).unwrap();
        setToast({ type: "success", msg: "Machine created" });
      }
      setOpen(false);
      setForm({ name: "", type: "Pump" });
    } catch (e: any) {
      setToast({ type: "error", msg: e?.message ?? "Save failed" });
    }
  }

  return (
    <Box sx={{ p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Machines</Typography>
        <Button
          variant="contained"
          onClick={() => {
            setForm({ name: "", type: "Pump" });
            setOpen(true);
          }}
        >
          New Machine
        </Button>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ height: 520 }}>
        <DataGrid
          rows={items}
          columns={cols}
          loading={loading}
          getRowId={(r) => r.id}
          slots={{ toolbar: GridToolbar }}
          disableRowSelectionOnClick
        />
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{form.id ? "Edit Machine" : "Create Machine"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Name"
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              autoFocus
            />
            <TextField
              label="Type"
              select
              value={form.type}
              onChange={(e) => setForm((s) => ({ ...s, type: e.target.value as MachineType }))}
            >
              <MenuItem value="Pump">Pump</MenuItem>
              <MenuItem value="Fan">Fan</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={onSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!toast} autoHideDuration={2500} onClose={() => setToast(null)}>
        <Alert severity={toast?.type || "success"}>{toast?.msg || ""}</Alert>
      </Snackbar>
    </Box>
  );
}
