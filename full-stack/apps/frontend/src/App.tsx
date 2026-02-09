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
import { logout } from "./store/authSlice";
import MonitoringTimeSeriesDrawer from "./components/TimeSeriesDrawer";

function sensorLabel(v: string | null) {
  if (!v) return "-";
  return v === "HF_plus" ? "HF+" : v;
}

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items, total, status, error, page, pageSize, sortBy, sortOrder } =
    useSelector((s: RootState) => s.monitoringPoints);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<{ id: string; title: string } | null>(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  function openTimeSeries(id: string, title: string) {
    setSelected({ id, title });
    setDrawerOpen(true);
  }

  useEffect(() => {
    dispatch(fetchMonitoringPoints());
  }, [dispatch, page, pageSize, sortBy, sortOrder]);

  const columns: GridColDef[] = useMemo(
    () => [
      { field: "machineName", headerName: "Machine Name", flex: 1, sortable: true },
      {
        field: "machineType",
        headerName: "Machine Type",
        width: 150,
        sortable: true,
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
        headerName: "Monitoring Point",
        flex: 1,
        sortable: true,
      },
      {
        field: "sensorModel",
        headerName: "Sensor Model",
        width: 150,
        sortable: true,
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
        width: 140,
        renderCell: (params) => (
          <Button 
            size="small" 
            onClick={() => {
              openTimeSeries(params.row.id, `${params.row.monitoringPointName} • ${params.row.machineName}`);
            }}
          >
            View
          </Button>
        ),
      },
    ],
    []
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
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

      <Box sx={{ height: 560, mt: 2 }}>
        <DataGrid
          rows={items}
          columns={columns}
          rowCount={total}
          loading={false}
          paginationMode="server"
          sortingMode="server"
          disableRowSelectionOnClick
          density="compact"
          pageSizeOptions={[5, 10, 20]}
          paginationModel={{ page, pageSize }}
          onPaginationModelChange={(m) => {
            if (m.page !== page) dispatch(setPage(m.page));
            if (m.pageSize !== pageSize) dispatch(setPageSize(m.pageSize));
          }}
          sortModel={sortModel}
          onSortModelChange={(model) => {
            const next = model[0];
            dispatch(setSort({ sortBy: (next?.field as "machineName" | "machineType" | "monitoringPointName" | "sensorModel" | "createdAt") ?? "machineName", sortOrder: (next?.sort as "asc" | "desc") ?? "asc" }));
          }}
          onRowClick={(params) => {
            openTimeSeries(params.row.id, `${params.row.monitoringPointName} • ${params.row.machineName}`);
          }}
          localeText={{
            noRowsLabel: "No monitoring points found. Run the seed script to generate sample data.",
          }}
        />
      </Box>
      
      <MonitoringTimeSeriesDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        monitoringPointId={selected?.id ?? null}
        title={selected?.title}
      />
    </Container>
  );
}