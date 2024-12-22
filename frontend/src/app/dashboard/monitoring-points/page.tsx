import React from "react";
import { Box, Card } from "@mui/material";
import MonitoringPointForm from "@/components/dashboard/monitoring-points/monitoringPointForm";
import MonitoringPointsList from "@/components/dashboard/monitoring-points/monitoringPointList";
import { MainNav } from "@/components/dashboard/layout/main-nav";
import { config } from "@/config";
import { Metadata } from "next";

export const metadata = {
  title: `Machines | Dashboard | ${config.site.name}`,
} satisfies Metadata;

export default function MonitoringPointsPage() {
  return (
    <>
      <MainNav title="Monitoring Points" />
      <Box
        component="main"
        sx={{
          p: 4,
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          gap: 3,
        }}
      >
        <Card sx={{ p: 3, boxShadow: 1 }}>
          <MonitoringPointForm />
        </Card>

        <MonitoringPointsList />
      </Box>
    </>
  );
}
