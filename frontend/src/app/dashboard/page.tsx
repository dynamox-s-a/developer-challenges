import * as React from "react";
import type { Metadata } from "next";
import Grid from "@mui/material/Unstable_Grid2";
import { config } from "@/config";
import { MainNav } from "@/components/dashboard/layout/main-nav";
import { MonitoringPointsChart } from "@/components/dashboard/overview/monitoringPointChart";
import { MachineDonutChart } from "@/components/dashboard/overview/machineDonutChart";

export const metadata = {
  title: `Overview | Dashboard | ${config.site.name}`,
} satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <>
      <MainNav title="Overview" />
      <Grid container spacing={3} sx={{ p: 4 }}>
        <Grid lg={8} xs={12}>
          <MonitoringPointsChart />
        </Grid>
        <Grid lg={4} md={6} xs={12}>
          <MachineDonutChart />
        </Grid>
      </Grid>
    </>
  );
}
