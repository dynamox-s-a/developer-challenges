import { useEffect, useMemo } from "react";
import {
  Container,
  Typography,
  Alert,
  Box,
  Stack,
  Button,
  Chip,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  DataGrid,
  type GridColDef,
  type GridSortModel,
  GridToolbar,
} from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";
import {
  fetchMonitoringPoints,
  setPage,
  setPageSize,
  setSort,
} from "./store/monitoringPointsSlice";
import { logout } from "./store/authSlice";

function sensorLabel(v: string | null) {
  if (!v) return "-";
  return v === "HF_plus" ? "HF+" : v;
}

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, total, loading, error, page, pageSize, sortBy, sortOrder } =
    useSelector((s: RootState) => s.monitoringPoints);

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
    ],
    []
  );

  const sortModel: GridSortModel = [{ field: sortBy, sort: sortOrder }];

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
            onClick={() => dispatch(logout())}
          >
            Logout
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => dispatch(fetchMonitoringPoints())}
            disabled={loading}
          >
            Refresh
          </Button>
        </Stack>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ height: 560, mt: 2 }}>
        <DataGrid
          rows={items}
          columns={columns}
          rowCount={total}
          loading={loading}
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
            if (!next?.field || !next.sort) return;
            dispatch(setSort({ sortBy: next.field as any, sortOrder: next.sort }));
          }}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 400 },
            },
          }}
          localeText={{
            noRowsLabel: "No monitoring points found. Run the seed script to generate sample data.",
          }}
        />
      </Box>
    </Container>
  );
}