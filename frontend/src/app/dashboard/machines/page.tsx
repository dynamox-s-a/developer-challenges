import * as React from "react";
import type { Metadata } from "next";
import { config } from "@/config";
import MachineForm from "@/components/dashboard/machines/machineForm";
import MachinesList from "@/components/dashboard/machines/machinesList";
import { MainNav } from "@/components/dashboard/layout/main-nav";
import Grid from "@mui/material/Unstable_Grid2";

export const metadata = {
  title: `Machines | Dashboard | ${config.site.name}`,
} satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <>
      <MainNav title="Machine Management" />
      <Grid container spacing={3} sx={{ p: 4 }}>
        <Grid lg={4} xs={12}>
          <MachineForm />
        </Grid>

        <Grid lg={8} xs={12}>
          <MachinesList />
        </Grid>
      </Grid>
    </>
  );
}
