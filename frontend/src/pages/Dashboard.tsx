import { useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Container,
  Grid as MuiGrid,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import {
  fetchMachinesStart,
  fetchMachinesSuccess,
  fetchMachinesFailure,
} from "../store/slices/machinesSlice";
import {
  fetchMonitoringPointsStart,
  fetchMonitoringPointsSuccess,
  fetchMonitoringPointsFailure,
} from "../store/slices/monitoringPointsSlice";
import { getMachines, getMonitoringPoints } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  const machines = useSelector((state: RootState) => state.machines.data);
  const monitoringPoints = useSelector(
    (state: RootState) => state.monitoringPoints.data,
  );
  const loading = useSelector(
    (state: RootState) =>
      state.machines.loading || state.monitoringPoints.loading,
  );
  const error = useSelector(
    (state: RootState) => state.machines.error || state.monitoringPoints.error,
  );

  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchMachinesStart());
      dispatch(fetchMonitoringPointsStart());

      try {
        const [machinesData, monitoringPointsData] = await Promise.all([
          getMachines(),
          getMonitoringPoints(),
        ]);

        dispatch(fetchMachinesSuccess(machinesData));
        dispatch(fetchMonitoringPointsSuccess(monitoringPointsData));
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        dispatch(
          fetchMachinesFailure(err.message || "Failed to load machines"),
        );
        dispatch(
          fetchMonitoringPointsFailure(
            err.message || "Failed to load monitoring points",
          ),
        );
      }
    };

    fetchData();
  }, [dispatch]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const machineCount = machines.length;
  const monitoringPointCount = monitoringPoints.length;
  const pumpCount = machines.filter(
    (machine) => machine.type === "Pump",
  ).length;
  const fanCount = machines.filter((machine) => machine.type === "Fan").length;
  const pointsWithSensors = monitoringPoints.filter(
    (point) => point.sensor,
  ).length;

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>

      <Typography variant="subtitle1" gutterBottom>
        Bem vindo de volta
      </Typography>

      {error && (
        <Paper
          sx={{
            p: 2,
            mb: 3,
            bgcolor: "error.light",
            color: "error.contrastText",
          }}
        >
          <Typography>{error}</Typography>
        </Paper>
      )}

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Visão Geral
        </Typography>

        <MuiGrid container spacing={3}>
          <MuiGrid item xs={12} md={6} lg={3}>
            <Card sx={{ bgcolor: "primary.light" }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {machineCount}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  Máquinas
                </Typography>
              </CardContent>
            </Card>
          </MuiGrid>

          <MuiGrid item xs={12} md={6} lg={3}>
            <Card sx={{ bgcolor: "success.light" }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {monitoringPointCount}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  Pontos de Monitoramento
                </Typography>
              </CardContent>
            </Card>
          </MuiGrid>

          <MuiGrid item xs={12} md={6} lg={3}>
            <Card sx={{ bgcolor: "warning.light" }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {pointsWithSensors}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  Pontos com Sensores
                </Typography>
              </CardContent>
            </Card>
          </MuiGrid>
        </MuiGrid>
      </Box>

      <MuiGrid container spacing={4}>
        <MuiGrid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Tipos de Máquinas
            </Typography>
            <Box
              sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <Box>
                <Typography variant="body2" gutterBottom>
                  Pumps
                </Typography>
                <Box
                  sx={{
                    height: 10,
                    bgcolor: "background.default",
                    borderRadius: 1,
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      width: `${machineCount ? (pumpCount / machineCount) * 100 : 0}%`,
                      bgcolor: "primary.main",
                    }}
                  />
                </Box>
                <Typography variant="subtitle2" sx={{ mt: 0.5 }}>
                  {pumpCount} (
                  {machineCount > 0
                    ? Math.round((pumpCount / machineCount) * 100)
                    : 0}
                  %)
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" gutterBottom>
                  Fans
                </Typography>
                <Box
                  sx={{
                    height: 10,
                    bgcolor: "background.default",
                    borderRadius: 1,
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      width: `${machineCount ? (fanCount / machineCount) * 100 : 0}%`,
                      bgcolor: "secondary.main",
                    }}
                  />
                </Box>
                <Typography variant="subtitle2" sx={{ mt: 0.5 }}>
                  {fanCount} (
                  {machineCount > 0
                    ? Math.round((fanCount / machineCount) * 100)
                    : 0}
                  %)
                </Typography>
              </Box>
            </Box>
          </Paper>
        </MuiGrid>
      </MuiGrid>
    </Container>
  );
}
