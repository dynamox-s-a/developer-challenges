import * as React from "react";
import type { Metadata } from "next";

import { config } from "@/config";
import MachineForm from "@/components/dashboard/machines/machineForm";
import MachinesList from "@/components/dashboard/machines/machinesList";
import { MainNav } from "@/components/dashboard/layout/main-nav";
import { Box } from "@mui/system";
import { Card } from "@mui/material";

export const metadata = {
  title: `Machines | Dashboard | ${config.site.name}`,
} satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <>
      <MainNav title="Machine Management" />
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
          <MachineForm />
        </Card>

        <MachinesList />
      </Box>
    </>
  );
}
