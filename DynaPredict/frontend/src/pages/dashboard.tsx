import { DashboardLayout } from "../components/dashboard/layout";
import { MonitoringPointTable } from "../components/dashboard/monitoring-point";
import { Typography, Divider } from "@mui/material";

// Dashboard page
export function Dashboard() {
  return (
    <DashboardLayout>
      <Typography variant="h4" gutterBottom>
        Visão Geral da Fábrica
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Typography variant="h5" sx={{ mb: 2 }}>
        Pontos de Monitoramento Cadastrados
      </Typography>

      <MonitoringPointTable data={[]} />
    </DashboardLayout>
  );
}

export default Dashboard;
