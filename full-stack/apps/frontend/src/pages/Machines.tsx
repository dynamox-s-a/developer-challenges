import { useEffect, useMemo, useState, useCallback } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Stack,
  Button,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import LogoutIcon from "@mui/icons-material/Logout";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import CategoryIcon from "@mui/icons-material/Category";

import { DataGrid, GridToolbar, type GridColDef } from "@mui/x-data-grid";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addMachine, editMachine, loadMachines, removeMachine } from "../store/machinesSlice";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import type { Machine, MachineType } from "../api/machines";
import { MachineForm } from "../components/MachineForm";
import { Toast } from "../components/Toast";
import { Footer } from "../components/Footer";

type FormState = { id?: string; name: string; type: MachineType };

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <Paper variant="outlined" sx={{ p: 2, flex: 1, minWidth: 180 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box sx={{ opacity: 0.85 }}>{icon}</Box>
        <Box>
          <Typography variant="caption" sx={{ opacity: 0.75 }}>
            {title}
          </Typography>
          <Typography variant="h6" sx={{ lineHeight: 1.1 }}>
            {value}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

export default function MachinesPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { items, loading, error } = useAppSelector((s: any) => s.machines);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>({ name: "", type: "Pump" });
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // UI
  const [q, setQ] = useState("");

  // Row actions menu
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuRow, setMenuRow] = useState<Machine | null>(null);

  const openMenu = (e: React.MouseEvent<HTMLElement>, row: Machine) => {
    e.stopPropagation();
    setMenuRow(row);
    setMenuAnchor(e.currentTarget);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
    setMenuRow(null);
  };

  useEffect(() => {
    dispatch(loadMachines());
  }, [dispatch]);

  const filteredRows = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return items;
    return (items as Machine[]).filter((m) => {
      const hay = `${m.name} ${m.type}`.toLowerCase();
      return hay.includes(qq);
    });
  }, [items, q]);

  const typeCounts = useMemo(() => {
    const map = new Map<string, number>();
    (items as Machine[]).forEach((m) => map.set(m.type, (map.get(m.type) ?? 0) + 1));
    return map;
  }, [items]);

  const cols: GridColDef[] = useMemo(
    () => [
      {
        field: "name",
        headerName: "Name",
        flex: 1,
        minWidth: 200,
      },
      {
        field: "type",
        headerName: "Type",
        width: 140,
        renderCell: (params) => (
          <Chip size="small" variant="outlined" label={params.value} />
        ),
      },
      {
        field: "actions",
        headerName: "",
        width: 70,
        sortable: false,
        filterable: false,
        align: "right",
        headerAlign: "right",
        renderCell: (params) => (
          <IconButton size="small" onClick={(e) => openMenu(e, params.row as Machine)}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
        ),
      },
    ],
    []
  );

  const onSave = useCallback(async () => {
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
  }, [dispatch, form]);

  const onDelete = useCallback(
    async (row: Machine) => {
      closeMenu();
      if (!confirm(`Delete machine "${row.name}"?`)) return;
      try {
        await dispatch(removeMachine(row.id)).unwrap();
        setToast({ type: "success", msg: "Machine deleted" });
      } catch (e: any) {
        setToast({ type: "error", msg: e?.message ?? "Failed to delete" });
      }
    },
    [dispatch]
  );

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar
        position="sticky"
        elevation={0}
        color="default"
        sx={{ borderBottom: "1px solid", borderColor: "divider" }}
      >
        <Toolbar>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
            <PrecisionManufacturingIcon sx={{ opacity: 0.9 }} />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Machines
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.75 }}>
                CRUD • List • Search • Responsive
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/")}
            >
              Back
            </Button>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setForm({ name: "", type: "Pump" });
                setOpen(true);
              }}
            >
              New
            </Button>

            <Tooltip title="Refresh">
              <IconButton onClick={() => dispatch(loadMachines())}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Logout">
              <IconButton
                onClick={() => {
                  dispatch(logout());
                  navigate("/login");
                }}
              >
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>

        {loading && <LinearProgress />}
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3, flex: 1 }}>
        {/* Stats */}
        <Stack direction={isMobile ? "column" : "row"} spacing={2} sx={{ mb: 2 }}>
          <StatCard title="Total machines" value={(items as Machine[]).length} icon={<PrecisionManufacturingIcon />} />
          <StatCard title="Types" value={typeCounts.size} icon={<CategoryIcon />} />
          <Paper variant="outlined" sx={{ p: 2, flex: 1, minWidth: 180 }}>
            <Typography variant="caption" sx={{ opacity: 0.75 }}>
              Breakdown
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
              {Array.from(typeCounts.entries()).map(([t, n]) => (
                <Chip key={t} size="small" variant="outlined" label={`${t}: ${n}`} sx={{ mb: 1 }} />
              ))}
              {typeCounts.size === 0 && (
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  —
                </Typography>
              )}
            </Stack>
          </Paper>
        </Stack>

        {/* Search + error */}
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Stack
            direction={isMobile ? "column" : "row"}
            spacing={2}
            alignItems={isMobile ? "stretch" : "center"}
          >
            <TextField
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search (name, type)..."
              size="small"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            <Stack direction="row" spacing={1} sx={{ whiteSpace: "nowrap" }}>
              <Chip size="small" variant="outlined" label={`Rows: ${filteredRows.length}`} />
            </Stack>
          </Stack>

          {error && (
            <>
              <Divider sx={{ my: 2 }} />
              <Alert
                severity="error"
                action={
                  <Button onClick={() => dispatch(loadMachines())} color="inherit" size="small">
                    Retry
                  </Button>
                }
              >
                {error}
              </Alert>
            </>
          )}
        </Paper>

        {/* Grid */}
        <Paper variant="outlined" sx={{ overflow: "hidden" }}>
          <Box sx={{ height: isMobile ? 520 : 620 }}>
            <DataGrid
              rows={filteredRows}
              columns={cols}
              loading={loading}
              getRowId={(r) => (r as Machine).id}
              slots={{ toolbar: isMobile ? undefined : GridToolbar }}
              disableRowSelectionOnClick
              sx={{
                border: 0,
                "& .MuiDataGrid-columnHeaders": {
                  bgcolor: "background.paper",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                },
              }}
              localeText={{
                noRowsLabel: loading ? "Loading..." : "No machines found.",
              }}
            />
          </Box>
        </Paper>

        {/* Row actions menu */}
        <Menu
          anchorEl={menuAnchor}
          open={!!menuAnchor}
          onClose={closeMenu}
          onClick={(e) => e.stopPropagation()}
        >
          <MenuItem
            onClick={() => {
              const row = menuRow;
              closeMenu();
              if (!row) return;
              setForm({ id: row.id, name: row.name, type: row.type });
              setOpen(true);
            }}
          >
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>

          <MenuItem
            onClick={() => {
              const row = menuRow;
              if (row) onDelete(row);
            }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </Menu>

        {/* Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle sx={{ fontWeight: 700 }}>
            {form.id ? "Edit Machine" : "Create Machine"}
          </DialogTitle>
          <DialogContent dividers>
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
      </Container>

      <Footer />
    </Box>
  );
}