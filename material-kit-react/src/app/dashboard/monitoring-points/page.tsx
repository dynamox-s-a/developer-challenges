import * as React from "react";
import type { Metadata } from "next";
import Stack from "@mui/material/Stack";

import { config } from "@/config";
import { Grid } from "@mui/material";
import { MainNav } from "@/components/dashboard/layout/main-nav";
import MonitoringPointForm from "@/components/dashboard/monitoring-points/monitoringPointForm";

export const metadata = {
  title: `Machines | Dashboard | ${config.site.name}`,
} satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <>
      <MainNav title="Monitoring Points" />
      <Stack spacing={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <MonitoringPointForm />
          </Grid>
          <Grid item xs={12} md={6}>
            {/* <MonitoringPointList /> */}
          </Grid>
        </Grid>
      </Stack>
    </>
  );
}
