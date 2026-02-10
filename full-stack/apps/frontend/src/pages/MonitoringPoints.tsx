import { useEffect, useMemo, useState, useCallback } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Stack,
  Button,
  Chip,
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
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FactoryIcon from "@mui/icons-material/PrecisionManufacturing";
import SensorsIcon from "@mui/icons-material/Sensors";
import DataUsageIcon from "@mui/icons-material/DataUsage";

import {
  DataGrid,
  GridToolbar,
  type GridColDef,
  type GridSortModel,
  type GridPaginationModel,
} from "@mui/x-data-grid";

import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../store";

import {
  fetchMonitoringPoints,
  setPage,
  setPageSize,
  setSort,
} from "../store/monitoringPointsSlice";

import {
  loadMachinesForSelect,
  addMonitoringPoint,
  editMonitoringPoint,
  removeMonitoringPoint,
} from "../store/monitoringPointsCrudSlice";

import { logout } from "../store/authSlice";
import { RequireAuth } from "../components/RequireAuth";
import MonitoringTimeSeriesDrawer from "../components/TimeSeriesDrawer";
import { MonitoringPointForm } from "../components/MonitoringPointForm";
import { Toast } from "../components/Toast";
import { Footer } from "../components/Footer";

function sensorLabel(v: string | null) {
  if (!v) return "-";
  return v === "HF_plus" ? "HF+" : v;
}

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

export default function MonitoringPointsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { items, total, status, error, page, pageSize, sortBy, sortOrder } =
    useSelector((s: RootState) => s.monitoringPoints);

  const { machines } = useSelector((s: RootState) => s.monitoringPointsCrud);

  // UI state
  const [q, setQ] = useState(""); 
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<{ id: string; title: string } | null>(null);

  // CRUD dialog
  const [crudOpen, setCrudOpen] = useState(false);
  const [crudForm, setCrudForm] = useState<{
    id?: string;
    machineId: string;
    name: string;
    sensorUniqueId: string;
    sensorModel: "HF_plus" | "TcAg" | "TcAs";
  }>({
    machineId: "",
    name: "",
    sensorUniqueId: "",
    sensorModel: "HF_plus",
  });

  // Toast
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Row actions menu
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuRow, setMenuRow] = useState<any>(null);

  const openMenu = (e: React.MouseEvent<HTMLElement>, row: any) => {
    e.stopPropagation();
    setMenuRow(row);
    setMenuAnchor(e.currentTarget);
  };
  const closeMenu = () => {
    setMenuAnchor(null);
    setMenuRow(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const openTimeSeries = (id: string, title: string) => {
    setSelected({ id, title });
    setDrawerOpen(true);
  };

  const handleCreate = () => {
    setCrudForm({
      machineId: "",
      name: "",
      sensorUniqueId: "",
      sensorModel: "HF_plus",
    });
    setCrudOpen(true);
  };

  const handleEdit = (row: any) => {
    setCrudForm({
      id: row.id,
      machineId: "",
      name: row.monitoringPointName,
      sensorUniqueId: row.sensorUniqueId,
      sensorModel: row.sensorModel,
    });
    setCrudOpen(true);
  };

  const handleDelete = async (row: any) => {
    closeMenu();
    if (!confirm(`Delete monitoring point "${row.monitoringPointName}"?`)) return;
    try {
      await dispatch(removeMonitoringPoint(row.id)).unwrap();
      setToast({ type: "success", msg: "Monitoring point deleted" });
      dispatch(fetchMonitoringPoints());
    } catch (e: any) {
      setToast({ type: "error", msg: e?.message ?? "Failed to delete" });
    }
  };

  const handleSave = async () => {
    if (!crudForm.id) {
      if (!crudForm.machineId || !crudForm.name.trim() || !crudForm.sensorUniqueId.trim()) {
        setToast({ type: "error", msg: "All fields are required" });
        return;
      }
      const selectedMachine = machines.find((m: any) => m.id === crudForm.machineId);
      if (
        selectedMachine?.type === "Pump" &&
        (crudForm.sensorModel === "TcAg" || crudForm.sensorModel === "TcAs")
      ) {
        setToast({ type: "error", msg: "Pump machines cannot use TcAg or TcAs sensors" });
        return;
      }
    } else {
      if (!crudForm.name.trim()) {
        setToast({ type: "error", msg: "Name is required" });
        return;
      }
    }

    try {
      if (crudForm.id) {
        await dispatch(editMonitoringPoint({ id: crudForm.id, name: crudForm.name })).unwrap();
        setToast({ type: "success", msg: "Monitoring point updated" });
      } else {
        await dispatch(
          addMonitoringPoint({
            machineId: crudForm.machineId,
            name: crudForm.name,
            sensor: { uniqueId: crudForm.sensorUniqueId, model: crudForm.sensorModel },
          })
        ).unwrap();
        setToast({ type: "success", msg: "Monitoring point created" });
      }

      setCrudOpen(false);
      dispatch(fetchMonitoringPoints());
    } catch (e: any) {
      setToast({ type: "error", msg: e?.message ?? "Save failed" });
    }
  };

  useEffect(() => {
    dispatch(loadMachinesForSelect());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchMonitoringPoints());
  }, [dispatch, page, pageSize, sortBy, sortOrder]);

  const visibleRows = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return items;
    return items.filter((r: any) => {
      const hay = [
        r.machineName,
        r.machineType,
        r.monitoringPointName,
        r.sensorModel,
        r.sensorUniqueId,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(qq);
    });
  }, [items, q]);

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "machineName",
        headerName: "Machine",
        flex: 1,
        minWidth: 160,
        sortable: true,
      },
      {
        field: "machineType",
        headerName: "Type",
        width: 110,
        sortable: true,
        renderCell: (params) => (
          <Chip size="small" label={params.value} variant="outlined" />
        ),
      },
      {
        field: "monitoringPointName",
        headerName: "Monitoring Point",
        flex: 1,
        minWidth: 200,
        sortable: true,
      },
      {
        field: "sensorModel",
        headerName: "Sensor",
        width: 110,
        sortable: true,
        renderCell: (params) => (
          <Chip size="small" label={sensorLabel(params.value)} variant="outlined" />
        ),
      },
      {
        field: "actions",
        headerName: "",
        sortable: false,
        width: 70,
        align: "right",
        headerAlign: "right",
        renderCell: (params) => (
          <IconButton
            size="small"
            onClick={(e) => openMenu(e, params.row)}
            aria-label="row actions"
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        ),
      },
    ],
    []
  );

  const sortModel: GridSortModel = useMemo(
    () => [{ field: sortBy, sort: sortOrder }],
    [sortBy, sortOrder]
  );

  const onPaginationModelChange = useCallback(
    (m: GridPaginationModel) => {
      if (status === "loading" && m.page === 0 && page > 0) return;

      if (m.page !== page) dispatch(setPage(m.page));
      if (m.pageSize !== pageSize) dispatch(setPageSize(m.pageSize));
    },
    [dispatch, page, pageSize, status]
  );

  const onSortModelChange = useCallback(
    (model: GridSortModel) => {
      const next = model[0];
      dispatch(
        setSort({
          sortBy:
            (next?.field as
              | "machineName"
              | "machineType"
              | "monitoringPointName"
              | "sensorModel"
              | "createdAt") ?? "machineName",
          sortOrder: (next?.sort as "asc" | "desc") ?? "asc",
        })
      );
    },
    [dispatch]
  );

  const uniqueMachines = useMemo(() => {
    const set = new Set<string>();
    items.forEach((r: any) => r.machineName && set.add(r.machineName));
    return set.size;
  }, [items]);

  const uniqueSensors = useMemo(() => {
    const set = new Set<string>();
    items.forEach((r: any) => r.sensorUniqueId && set.add(r.sensorUniqueId));
    return set.size;
  }, [items]);

  return (
    <RequireAuth>
      <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <AppBar position="sticky" elevation={0} color="default" sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
          <Toolbar>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
              <DataUsageIcon sx={{ opacity: 0.9 }} />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Monitoring Points
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.75 }}>
                  Server-side pagination • Sort • CRUD • Time series
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1}>
              <Button component={Link} to="/machines" variant="outlined">
                Machines
              </Button>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreate}
              >
                New
              </Button>

              <Tooltip title="Refresh">
                <IconButton onClick={() => dispatch(fetchMonitoringPoints())}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Logout">
                <IconButton onClick={handleLogout}>
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Toolbar>
          {status === "loading" && <LinearProgress />}
        </AppBar>

        <Container maxWidth="lg" sx={{ py: 3, flex: 1 }}>
          {/* Top stats */}
          <Stack
            direction={isMobile ? "column" : "row"}
            spacing={2}
            sx={{ mb: 2 }}
          >
            <StatCard
              title="Total (server)"
              value={total}
              icon={<DataUsageIcon />}
            />
            <StatCard
              title="Machines in current page"
              value={uniqueMachines}
              icon={<FactoryIcon />}
            />
            <StatCard
              title="Sensors in current page"
              value={uniqueSensors}
              icon={<SensorsIcon />}
            />
          </Stack>

          {/* Search + status */}
          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Stack
              direction={isMobile ? "column" : "row"}
              spacing={2}
              alignItems={isMobile ? "stretch" : "center"}
            >
              <TextField
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search in current page (machine, type, mp name, sensor...)"
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
                <Chip
                  size="small"
                  variant="outlined"
                  label={`Page: ${page + 1}`}
                />
                <Chip
                  size="small"
                  variant="outlined"
                  label={`Rows: ${items.length}`}
                />
              </Stack>
            </Stack>

            {status === "failed" && (
              <>
                <Divider sx={{ my: 2 }} />
                <Alert
                  severity="error"
                  action={
                    <Button onClick={() => dispatch(fetchMonitoringPoints())} color="inherit" size="small">
                      Retry
                    </Button>
                  }
                >
                  {error ?? "Failed to load monitoring points"}
                </Alert>
              </>
            )}
          </Paper>

          {/* Grid */}
          <Paper variant="outlined" sx={{ overflow: "hidden" }}>
            <Box sx={{ height: isMobile ? 520 : 620 }}>
              <DataGrid
                rows={visibleRows}
                columns={columns}
                getRowId={(r) => r.id}
                disableRowSelectionOnClick
                paginationMode="server"
                sortingMode="server"
                rowCount={total}
                paginationModel={{ page, pageSize }}
                onPaginationModelChange={onPaginationModelChange}
                sortModel={sortModel}
                onSortModelChange={onSortModelChange}
                loading={status === "loading"}
                slots={{ toolbar: isMobile ? undefined : GridToolbar }}
                pageSizeOptions={isMobile ? [10, 20] : [10, 20, 50]}
                density={isMobile ? "compact" : "standard"}
                onRowClick={(params) => {
                  openTimeSeries(
                    params.row.id,
                    `${params.row.monitoringPointName} • ${params.row.machineName}` 
                  );
                }}
                sx={{
                  border: 0,
                  "& .MuiDataGrid-columnHeaders": {
                    bgcolor: "background.paper",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  },
                }}
                localeText={{
                  noRowsLabel:
                    status === "loading"
                      ? "Loading..."
                      : "No monitoring points found. Run seed script to generate sample data.",
                }}
              />
            </Box>
          </Paper>

          {/* Quick help empty (server total) */}
          {status === "succeeded" && total === 0 && (
            <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                No monitoring points found
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Run the seed script to generate demo data:
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, fontFamily: "monospace" }}>
                cd apps/backend && pnpm prisma:seed
              </Typography>
            </Paper>
          )}

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
                if (row) handleEdit(row);
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
                if (row) handleDelete(row);
              }}
            >
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          </Menu>

          {/* Drawer time series */}
          <MonitoringTimeSeriesDrawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            monitoringPointId={selected?.id ?? null}
            title={selected?.title}
          />

          {/* CRUD Dialog */}
          <Dialog open={crudOpen} onClose={() => setCrudOpen(false)} fullWidth maxWidth="sm">
            <DialogTitle sx={{ fontWeight: 700 }}>
              {crudForm.id ? "Edit Monitoring Point" : "Create Monitoring Point"}
            </DialogTitle>
            <DialogContent dividers>
              <MonitoringPointForm
                data={crudForm}
                machines={machines}
                onChange={setCrudForm}
                disabled={false}
                disableMachine={!!crudForm.id}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setCrudOpen(false)}>Cancel</Button>
              <Button variant="contained" onClick={handleSave}>
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
    </RequireAuth>
  );
}
