import MonitoringPointForm from "@/features/machines/components/monitoringPointForm";
import MonitoringPointsList from "@/features/machines/components/monitoringPointList";
import { Box, Typography } from "@mui/material";
import React from "react";

const MonitoringPointsPage = () => {
  return (
    <Box>
      <Typography variant="h4" component="h4" gutterBottom>
        Monitoring Points
      </Typography>
      <Box
        display="flex"
        gap="3rem"
        justifyContent="space-between"
        sx={{ flexDirection: { xs: "column", md: "row" } }}
      >
        <MonitoringPointForm />
        <MonitoringPointsList />
      </Box>
    </Box>
  );
};

export default MonitoringPointsPage;
