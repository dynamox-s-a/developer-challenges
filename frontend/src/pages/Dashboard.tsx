import { useEffect } from "react";
import { Box, Typography, Container, Grid as MuiGrid } from "@mui/material";
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
import LoadingScreen from "../components/LoadingScreen";
import ErrorAlert from "../components/ErrorAlert";
import OverviewCard from "../components/OverviewCard";
import ProgressBar from "../components/ProgressBar";

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
    return <LoadingScreen />;
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

      {error && <ErrorAlert message={error} />}

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Visão Geral
        </Typography>

        <MuiGrid container spacing={3}>
          <MuiGrid item xs={12} md={6} lg={3}>
            <OverviewCard
              title="Máquinas"
              value={machineCount}
              color="primary.light"
            />
          </MuiGrid>

          <MuiGrid item xs={12} md={6} lg={3}>
            <OverviewCard
              title="Pontos de Monitoramento"
              value={monitoringPointCount}
              color="success.light"
            />
          </MuiGrid>

          <MuiGrid item xs={12} md={6} lg={3}>
            <OverviewCard
              title="Pontos com Sensores"
              value={pointsWithSensors}
              color="warning.light"
            />
          </MuiGrid>
        </MuiGrid>
      </Box>

      <MuiGrid container spacing={4}>
        <MuiGrid item xs={12} md={6}>
          <Box sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Tipos de Máquinas
            </Typography>
            <Box
              sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <ProgressBar
                label="Pumps"
                value={pumpCount}
                percentage={
                  machineCount > 0
                    ? Math.round((pumpCount / machineCount) * 100)
                    : 0
                }
                color="primary.main"
              />

              <ProgressBar
                label="Fans"
                value={fanCount}
                percentage={
                  machineCount > 0
                    ? Math.round((fanCount / machineCount) * 100)
                    : 0
                }
                color="secondary.main"
              />
            </Box>
          </Box>
        </MuiGrid>
      </MuiGrid>
    </Container>
  );
}
