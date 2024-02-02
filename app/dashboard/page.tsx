"use client";
import { getMachines, getMonitoringPoints, useDispatch } from "@/lib/redux";
import { useEffect, useState } from "react";
import Head from "next/head";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import Header from "app/components/Header";
import MonitoringPointTable from "./tables/MonitoringPointTable";
import MonitoringPointForm from "./forms/MonitoringPointForm";
import MachineTable from "./tables/MachineTable";
import MachineForm from "./forms/MachineForm";
import UpdateMachineForm from "./forms/UpdateMachineForm";
import DeleteMachineForm from "./forms/DeleteMachineForm";
import styles from "./styles.module.css";

export default function Dashboard() {
  const [showForm, setShowForm] = useState<
    "add-monitoring-point" | "add-machine" | "update-machine" | "delete-machine" | null
  >(null);
  const dispatch = useDispatch();

  const handleAddMonitoringPoint = () => {
    setShowForm((state) => (state === "add-monitoring-point" ? null : "add-monitoring-point"));
  };

  const handleAddMachine = () => {
    setShowForm((state) => (state === "add-machine" ? null : "add-machine"));
  };

  const handleUpdateMachine = () => {
    setShowForm((state) => (state === "update-machine" ? null : "update-machine"));
  };

  const handleDeleteMachine = () => {
    setShowForm((state) => (state === "delete-machine" ? null : "delete-machine"));
  };

  useEffect(() => {
    dispatch(getMonitoringPoints());
    dispatch(getMachines());
  }, [dispatch]);

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Header />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack className={styles.tablesWrapper} spacing={3}>
            <Stack className={styles.tables} direction={"row"} spacing={8}>
              <Stack className={styles.mpTable}>
                <Typography variant="h4">Monitoring Points</Typography>
                <MonitoringPointTable />
              </Stack>
              <Stack className={styles.machinesTable}>
                <Typography variant="h4">Machines</Typography>
                <MachineTable />
              </Stack>
            </Stack>
            <Box className={styles.buttons}>
              <Button variant="text" onClick={handleAddMonitoringPoint}>
                Add Monitoring Point
              </Button>
              <Button variant="text" onClick={handleAddMachine}>
                Add Machine
              </Button>
              <Button variant="text" onClick={handleUpdateMachine}>
                Edit Machine
              </Button>
              <Button variant="text" onClick={handleDeleteMachine}>
                Delete Machine
              </Button>
            </Box>
            <Stack className={styles.form}>
              {showForm === "add-monitoring-point" ? <MonitoringPointForm /> : null}
              {showForm === "add-machine" ? <MachineForm /> : null}
              {showForm === "update-machine" ? <UpdateMachineForm /> : null}
              {showForm === "delete-machine" ? <DeleteMachineForm /> : null}
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
}
