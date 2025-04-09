import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchMonitoringPoints } from "../store/monitoring-point/monitoringPointThunks";
import MonitoringPointTable from "../components/MonitoringPointTable";
import MonitoringPointForm from "../components/MonitoringPointForm";
import { CircularProgress, Typography, Box } from "@mui/material";

const MonitoringPointPage = () => {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.monitoringPoints);

  useEffect(() => {
    dispatch(fetchMonitoringPoints());
  }, [dispatch]);

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Pontos de Monitoramento
      </Typography>

      <MonitoringPointForm />

      {status === "loading" && <CircularProgress />}
      {status === "failed" && <Typography color="error">{error}</Typography>}
      {status === "succeeded" && <MonitoringPointTable points={items} />}
    </Box>
  );
};

export default MonitoringPointPage;
