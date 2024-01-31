"use client";
import { useCallback, useMemo, useState } from "react";
import Head from "next/head";
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import { CustomersTable } from "./customers-table";
import { applyPagination } from "./apply-pagination";
import { signOut } from "next-auth/react";

const data = [
  {
    id: 18,
    name: "MP 1",
    machineId: 11,
    sensorId: 1,
    machine: { id: 11, name: "Machine 1", type: "fan", userId: 11 },
    sensor: { id: 1, model: "TcAg" },
  },
  {
    id: 19,
    name: "MP 2",
    machineId: 11,
    sensorId: 2,
    machine: { id: 11, name: "Machine 1", type: "fan", userId: 11 },
    sensor: { id: 2, model: "TcAs" },
  },
  {
    id: 18,
    name: "MP 1",
    machineId: 11,
    sensorId: 1,
    machine: { id: 11, name: "Machine 1", type: "fan", userId: 11 },
    sensor: { id: 1, model: "TcAg" },
  },
  {
    id: 19,
    name: "MP 2",
    machineId: 11,
    sensorId: 2,
    machine: { id: 11, name: "Machine 1", type: "fan", userId: 11 },
    sensor: { id: 2, model: "TcAs" },
  },
  {
    id: 20,
    name: "MP 3",
    machineId: 12,
    sensorId: 3,
    machine: { id: 12, name: "Machine 2", type: "pump", userId: 11 },
    sensor: { id: 3, model: "HF+" },
  },
  {
    id: 18,
    name: "MP 1",
    machineId: 11,
    sensorId: 1,
    machine: { id: 11, name: "Machine 1", type: "fan", userId: 11 },
    sensor: { id: 1, model: "TcAg" },
  },
  {
    id: 19,
    name: "MP 2",
    machineId: 11,
    sensorId: 2,
    machine: { id: 11, name: "Machine 1", type: "fan", userId: 11 },
    sensor: { id: 2, model: "TcAs" },
  },
  {
    id: 18,
    name: "MP 1",
    machineId: 11,
    sensorId: 1,
    machine: { id: 11, name: "Machine 1", type: "fan", userId: 11 },
    sensor: { id: 1, model: "TcAg" },
  },
  {
    id: 19,
    name: "MP 2",
    machineId: 11,
    sensorId: 2,
    machine: { id: 11, name: "Machine 1", type: "fan", userId: 11 },
    sensor: { id: 2, model: "TcAs" },
  },
  {
    id: 20,
    name: "MP 3",
    machineId: 12,
    sensorId: 3,
    machine: { id: 12, name: "Machine 2", type: "pump", userId: 11 },
    sensor: { id: 3, model: "HF+" },
  },
];

const useCustomers = (page, rowsPerPage) => {
  return useMemo(() => {
    return applyPagination(data, page, rowsPerPage);
  }, [page, rowsPerPage]);
};

export default function Dashboard() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const customers = useCustomers(page, rowsPerPage);
  console.log(customers);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <button onClick={() => signOut()}>LOGOUT</button>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Dashboard</Typography>
              </Stack>
              <div>
                <Button
                  // startIcon={
                  //   <SvgIcon fontSize="small">{ <PlusIcon /> */}</SvgIcon>
                  // }
                  variant="contained"
                >
                  Add
                </Button>
              </div>
            </Stack>
            <CustomersTable
              count={data.length}
              items={customers}
              onPageChange={handlePageChange}
              page={page}
              rowsPerPage={rowsPerPage}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
}
