import { useEffect, useMemo, useState } from "react";
import {
  Container,
  Typography,
  Alert,
  Box,
  Stack,
  Button,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  DataGrid,
  type GridColDef,
  type GridSortModel,
} from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import type { AppDispatch, RootState } from "./store";
import {
  fetchMonitoringPoints,
  setPage,
  setPageSize,
  setSort,
} from "./store/monitoringPointsSlice";
import { 
  loadMachinesForSelect,
  addMonitoringPoint,
  editMonitoringPoint,
  removeMonitoringPoint 
} from "./store/monitoringPointsCrudSlice";
import { logout } from "./store/authSlice";
import MonitoringTimeSeriesDrawer from "./components/TimeSeriesDrawer";
import { MonitoringPointForm } from "./components/MonitoringPointForm";
import { RequireAuth } from "./components/RequireAuth";
import { Toast } from "./components/Toast";
import { Footer } from "./components/Footer";

function sensorLabel(v: string | null) {
  if (!v) return "-";
  return v === "HF_plus" ? "HF+" : v;
}

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { items, total, status, error, page, pageSize, sortBy, sortOrder } =
    useSelector((s: RootState) => s.monitoringPoints);
  const { machines } = useSelector((s: RootState) => s.monitoringPointsCrud);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<{ id: string; title: string } | null>(null);
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
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  function openTimeSeries(id: string, title: string) {
    setSelected({ id, title });
    setDrawerOpen(true);
  }

  const handleCreateMonitoringPoint = () => {
    setCrudForm({
      machineId: "",
      name: "",
      sensorUniqueId: "",
      sensorModel: "HF_plus",
    });
    setCrudOpen(true);
  };

  const handleEditMonitoringPoint = (row: any) => {
    setCrudForm({
      id: row.id,
      machineId: "", 
      name: row.monitoringPointName,
      sensorUniqueId: row.sensorUniqueId,
      sensorModel: row.sensorModel,
    });
    setCrudOpen(true);
  };

  const handleDeleteMonitoringPoint = async (row: any) => {
    if (!confirm(`Delete monitoring point "${row.monitoringPointName}"?`)) return;
    try {
      await dispatch(removeMonitoringPoint(row.id)).unwrap();
      setToast({ type: "success", msg: "Monitoring point deleted" });
      dispatch(fetchMonitoringPoints());
    } catch (e: any) {
      setToast({ type: "error", msg: e?.message ?? "Failed to delete" });
    }
  };

  const handleSaveMonitoringPoint = async () => {
    if (!crudForm.machineId || !crudForm.name.trim() || !crudForm.sensorUniqueId.trim()) {
      setToast({ type: "error", msg: "All fields are required" });
      return;
    }

    // Validação: Pump não aceita TcAg/TcAs
    const selectedMachine = machines.find(m => m.id === crudForm.machineId);
    if (selectedMachine?.type === "Pump" && (crudForm.sensorModel === "TcAg" || crudForm.sensorModel === "TcAs")) {
      setToast({ type: "error", msg: "Pump machines cannot use TcAg or TcAs sensors" });
      return;
    }

    try {
      if (crudForm.id) {
        await dispatch(editMonitoringPoint({ 
          id: crudForm.id, 
          name: crudForm.name 
        })).unwrap();
        setToast({ type: "success", msg: "Monitoring point updated" });
      } else {
        await dispatch(addMonitoringPoint({
          machineId: crudForm.machineId,
          name: crudForm.name,
          sensor: {
            uniqueId: crudForm.sensorUniqueId,
            model: crudForm.sensorModel,
          },
        })).unwrap();
        setToast({ type: "success", msg: "Monitoring point created" });
      }
      setCrudOpen(false);
      dispatch(fetchMonitoringPoints());
    } catch (e: any) {
      setToast({ type: "error", msg: e?.message ?? "Save failed" });
    }
  };

  useEffect(() => {
    dispatch(fetchMonitoringPoints());
    dispatch(loadMachinesForSelect());
  }, [dispatch, page, pageSize, sortBy, sortOrder]);

  const columns: GridColDef[] = useMemo(
    () => [
      { 
        field: "machineName", 
        headerName: "Machine", 
        flex: 1, 
        minWidth: 120,
        sortable: true,
        align: 'center',
        headerAlign: 'center'
      },
      {
        field: "machineType",
        headerName: "Type",
        width: 80,
        sortable: true,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => (
          <Chip
            size="small"
            label={params.value}
            variant="outlined"
          />
        ),
      },
      { 
        field: "monitoringPointName", 
        headerName: "MP Name", 
        flex: 1, 
        minWidth: 120,
        sortable: true,
        align: 'center',
        headerAlign: 'center'
      },
      {
        field: "sensorModel",
        headerName: "Sensor",
        width: 70,
        sortable: true,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => (
          <Chip
            size="small"
            label={sensorLabel(params.value)}
            variant="outlined"
          />
        ),
      },
      {
        field: "actions",
        headerName: "Actions",
        sortable: false,
        width: isMobile ? 100 : 200,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => (
          <Stack direction={isMobile ? "column" : "row"} spacing={0.5}>
            <Button
              size="small"
              onClick={() => handleEditMonitoringPoint(params.row)}
              sx={{ minWidth: isMobile ? 60 : 'auto' }}
            >
              {isMobile ? "Edit" : "Edit"}
            </Button>
            <Button
              size="small"
              color="error"
              onClick={() => handleDeleteMonitoringPoint(params.row)}
              sx={{ minWidth: isMobile ? 60 : 'auto' }}
            >
              {isMobile ? "Del" : "Delete"}
            </Button>
          </Stack>
        ),
      },
    ],
    [isMobile]
  );

  const sortModel: GridSortModel = [{ field: sortBy, sort: sortOrder }];

  // Loading state
  if (status === "loading") {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <Box>
            <Typography variant="h5">Monitoring Points</Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Loading...
            </Typography>
          </Box>
        </Stack>
        <LinearProgress sx={{ mt: 2 }} />
      </Container>
    );
  }

  // Error state
  if (status === "failed") {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <Box>
            <Typography variant="h5">Monitoring Points</Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Stack>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <Alert severity="error">
            {error ?? "Failed to load monitoring points"}
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => dispatch(fetchMonitoringPoints())}
          >
            Retry
          </Button>
        </Stack>
      </Container>
    );
  }

  // Empty state
  if (status === "succeeded" && items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <Box>
            <Typography variant="h5">Monitoring Points</Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Stack>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <Typography variant="h6">No monitoring points found</Typography>
          <Typography variant="body2" color="text.secondary">
            Run the seed script to generate demo data.
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
            cd apps/backend && pnpm prisma:seed
          </Typography>
          <Button 
            variant="outlined" 
            onClick={() => dispatch(fetchMonitoringPoints())}
          >
            Refresh
          </Button>
        </Stack>
      </Container>
    );
  }

  return (
    <RequireAuth>
      <Container maxWidth="lg" sx={{ py: 4, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <Box>
            <Typography variant="h5">Monitoring Points</Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Total: {total}
            </Typography>
          </Box>

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              component={Link}
              to="/machines"
            >
              Machines
            </Button>
            <Button
              variant="contained"
              onClick={handleCreateMonitoringPoint}
            >
              New Monitoring Point
            </Button>
            <Button
              variant="outlined"
              onClick={handleLogout}
            >
              Logout
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => dispatch(fetchMonitoringPoints())}
            >
              Refresh
            </Button>
          </Stack>
        </Stack>

        <Box sx={{ height: isMobile ? 400 : 560, mt: 2, flexGrow: 1 }}>
          <DataGrid
            rows={items}
            columns={columns}
            loading={status === "loading"}
            getRowId={(r) => r.id}
            rowCount={total}
            paginationMode="server"
            pageSizeOptions={[10, 20, 50]}
            paginationModel={{ page, pageSize }}
            onPaginationModelChange={(m) => {
              if (m.page !== page) dispatch(setPage(m.page));
              if (m.pageSize !== pageSize) dispatch(setPageSize(m.pageSize));
            }}
            sortModel={sortModel}
            onSortModelChange={(model) => {
              const next = model[0];
              dispatch(setSort({ 
                sortBy: (next?.field as "machineName" | "machineType" | "monitoringPointName" | "sensorModel" | "createdAt") ?? "machineName", 
                sortOrder: (next?.sort as "asc" | "desc") ?? "asc" 
              }));
            }}
            onRowClick={(params) => {
              openTimeSeries(params.row.id, `${params.row.monitoringPointName} • ${params.row.machineName}`);
            }}
            localeText={{
              noRowsLabel: "No monitoring points found. Run seed script to generate sample data.",
            }}
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
        
        <MonitoringTimeSeriesDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          monitoringPointId={selected?.id ?? null}
          title={selected?.title}
        />

        <Dialog open={crudOpen} onClose={() => setCrudOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>{crudForm.id ? "Edit Monitoring Point" : "Create Monitoring Point"}</DialogTitle>
          <DialogContent>
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
            <Button variant="contained" onClick={handleSaveMonitoringPoint}>
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
      </Container>
    </RequireAuth>
  );
}