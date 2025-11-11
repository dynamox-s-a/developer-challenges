import { DashboardLayout } from "../components/dashboard/layout";
import { MonitoringPointTable } from "../components/dashboard/monitoring-point";
import { Typography, Divider } from "@mui/material";

export function Dashboard() {
  return (
    <DashboardLayout>
      <Typography variant="h4" gutterBottom>
        Visão Geral do Sistema
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <MonitoringPointTable />
    </DashboardLayout>
  );
}

export default Dashboard;
