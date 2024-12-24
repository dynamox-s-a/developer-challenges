import React from "react";
import MonitoringPointForm from "@/components/dashboard/monitoring-points/monitoringPointForm";
import MonitoringPointsList from "@/components/dashboard/monitoring-points/monitoringPointList";
import { MainNav } from "@/components/dashboard/layout/main-nav";
import { config } from "@/config";
import { Metadata } from "next";
import Grid from "@mui/material/Unstable_Grid2";

export const metadata = {
  title: `Machines | Dashboard | ${config.site.name}`,
} satisfies Metadata;

export default function MonitoringPointsPage() {
  return (
    <>
      <MainNav title="Monitoring Points" />
      <Grid container spacing={3} sx={{ p: 4 }}>
        <Grid lg={4} xs={12}>
          <MonitoringPointForm />
        </Grid>

        <Grid lg={8} xs={12}>
          <MonitoringPointsList />
        </Grid>
      </Grid>
    </>
  );
}
