import * as React from "react";
import type { Metadata } from "next";
import Stack from "@mui/material/Stack";

import { config } from "@/config";
import { Grid } from "@mui/material";
import MachineForm from "@/components/dashboard/machines/machineForm";
import MachinesList from "@/components/dashboard/machines/machinesList";
import { MainNav } from "@/components/dashboard/layout/main-nav";

export const metadata = {
  title: `Machines | Dashboard | ${config.site.name}`,
} satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <>
      <MainNav title="Machine Management" />
      <Stack spacing={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <MachineForm />
          </Grid>
          <Grid item xs={12} md={6}>
            <MachinesList />
          </Grid>
        </Grid>
      </Stack>
    </>
  );
}
