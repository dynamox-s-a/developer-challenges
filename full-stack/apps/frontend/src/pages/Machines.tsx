import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addMachine, editMachine, loadMachines, removeMachine } from "../store/machinesSlice";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import type { Machine, MachineType } from "../api/machines";
import { MachineForm } from "../components/MachineForm";
import { Toast } from "../components/Toast";
import { Footer } from "../components/Footer";

type FormState = { id?: string; name: string; type: MachineType };

export default function MachinesPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { items, loading, error } = useAppSelector((s: any) => s.machines);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>({ name: "", type: "Pump" });
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  useEffect(() => {
    dispatch(loadMachines());
  }, [dispatch]);

  const cols: GridColDef[] = useMemo(
    () => [
      { field: "name", headerName: "Name", flex: 1, minWidth: 150, align: 'center', headerAlign: 'center' },
      { field: "type", headerName: "Type", width: isMobile ? 80 : 120, align: 'center', headerAlign: 'center' },
      {
        field: "actions",
        headerName: "Actions",
        width: isMobile ? 120 : 220,
        sortable: false,
        filterable: false,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => {
          const row = params.row as Machine;
          return (
            <Stack direction={isMobile ? "column" : "row"} spacing={0.5}>
              <Button
                size="small"
                onClick={() => {
                  setForm({ id: row.id, name: row.name, type: row.type });
                  setOpen(true);
                }}
                sx={{ minWidth: isMobile ? 50 : 'auto' }}
              >
                {isMobile ? "Edit" : "Edit"}
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
                sx={{ minWidth: isMobile ? 50 : 'auto' }}
              >
                {isMobile ? "Del" : "Delete"}
              </Button>
            </Stack>
          );
        },
      },
    ],
    [isMobile, dispatch]
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
    <Box sx={{ p: 2, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Machines</Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            onClick={() => navigate("/")}
          >
            Back to Monitoring Points
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setForm({ name: "", type: "Pump" });
              setOpen(true);
            }}
          >
            New Machine
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              dispatch(logout());
              navigate("/login");
            }}
          >
            Logout
          </Button>
        </Stack>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ height: 520, flexGrow: 1 }}>
        <DataGrid
          rows={items}
          columns={cols}
          loading={loading}
          getRowId={(r) => r.id}
          slots={{ toolbar: GridToolbar }}
          disableRowSelectionOnClick
          sx={{
            '& .MuiDataGrid-root': {
              border: '1px solid rgba(224, 224, 224, 1)',
            },
            '& .MuiDataGrid-cell': {
              whiteSpace: 'normal',
              lineHeight: '1.2',
              textAlign: 'center',
            }
          }}
        />
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{form.id ? "Edit Machine" : "Create Machine"}</DialogTitle>
        <DialogContent>
          <MachineForm
            data={form}
            onChange={(data) => setForm(data as FormState)}
            disabled={false}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={onSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Toast
        open={!!toast}
        message={toast?.msg || ""}
        severity={toast?.type || "success"}
        onClose={() => setToast(null)}
      />
      
      <Footer />
    </Box>
  );
}
