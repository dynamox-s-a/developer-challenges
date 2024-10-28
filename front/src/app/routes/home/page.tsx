"use client";

import MonitoringPointsChart from "../../components/DashBoard/MonitoringPointsChart";
import QuantitysChart from "../../components/DashBoard/QuantitysChart";
import MachinesTypesChart from "../../components/DashBoard/MachinesTypesChart";
import { Box, Grid, Theme, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import MonitoringPointsService from "@/app/services/MonitoringPoints/MonitoringPointsService";
import MachineService from "@/app/services/Machine/MachineService";

export default function Page() {
  const isXs = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  let [machineState, setMachine] = useState([]);
  let [mPointsState, setMpointsState] = useState([]);

  useEffect(() => {
    const fetchMonitoringPoints = async () => {
      try {
        const points = await MonitoringPointsService.getAllMonitoringPoints();
        const machines = await MachineService.getAllMachines();
        setMachine(machines.data.machines);
        setMpointsState(points.data.monitoringPoints);
      } catch (error) {
        console.error("Error fetching monitoring points:", error);
      }
    };
    fetchMonitoringPoints();
  }, []);

  const sensorCounts =
    mPointsState &&
    mPointsState.reduce((acc: any, mPoint: any) => {
      acc[mPoint.sensorModel] = (acc[mPoint.sensorModel] || 0) + 1;
      return acc;
    }, {});

  const hfplusCount = (sensorCounts && sensorCounts["HF+"]) || 0;
  const tcagCount = (sensorCounts && sensorCounts["TcAg"]) || 0;
  const tcasCount = (sensorCounts && sensorCounts["TcAs"]) || 0;

  const machineCounts =
    machineState &&
    machineState.reduce((acc: any, machine: any) => {
      acc[machine.type] = (acc[machine.type] || 0) + 1;
      return acc;
    }, {});

  const fanCount = (machineCounts && machineCounts["FAN"]) || 0;
  const pumpCount = (machineCounts && machineCounts["PUMP"]) || 0;

  return (
    <Box p={5}>
      <Grid display={"flex"} justifyContent={"center"} container spacing={2}>
        <Grid item xs={12} md={5}>
          <Box mb={5} sx={{ height: "37dvh" }}>
            <MonitoringPointsChart
              hfplus={hfplusCount}
              tcag={tcagCount}
              tcas={tcasCount}
            />
          </Box>
          <Box mt={isXs ? 10 : 0} sx={{ height: "37dvh" }}>
            <MachinesTypesChart fan={pumpCount} pump={fanCount} />
          </Box>
        </Grid>
        <Grid item xs={12} mt={5} md={6}>
          <Box sx={{ height: "75dvh" }}>
            <QuantitysChart
              machines={machineState && machineState.length}
              monitoringPoints={mPointsState && mPointsState.length}
              sensors={3}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
