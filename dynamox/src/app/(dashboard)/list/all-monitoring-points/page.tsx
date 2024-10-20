import * as React from "react";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import PaginationButton from "@/src/components/Pagination";
import Table from "@/src/components/Table";
import { TableCell, TableRow } from "@mui/material";
import { MonitoringPoint, Machine, Sensor } from "@prisma/client";
import prisma from "@/src/lib/prisma";
import { ITEMS_PER_PAGE } from "@/src/constants";
import FormContainer from "@/src/components/FormContainer";

type AllMonitoringPointList = MonitoringPoint & {
  machine: Machine;
  sensors: Sensor[];
};

const columns = [
  { header: "Machine Name", accessor: "machineName" },
  { header: "Machine Type", accessor: "machineType" },
  { header: "Monitoring Point Name", accessor: "monitoringPointName" },
  { header: "Sensor Model", accessor: "sensorModel" },
];

const renderRow = (item: AllMonitoringPointList) => (
  <TableRow key={item.id}>
    <TableCell>{item.machine.name}</TableCell>
    <TableCell>{item.machine.type}</TableCell>
    <TableCell>{item.name}</TableCell>
    <TableCell>
      {item.sensors.map((sensor) => sensor.model).join(", ")}
    </TableCell>
  </TableRow>
);

const MonitoringPointListWithSensorsPage = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string };
}) => {
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;

  const [data, count] = await prisma.$transaction([
    prisma.monitoringPoint.findMany({
      include: { machine: true, sensors: true },
      take: ITEMS_PER_PAGE,
      skip: (page - 1) * ITEMS_PER_PAGE,
    }),
    prisma.monitoringPoint.count(),
  ]);

  return (
    <Paper className="machine-list-paper" square={false} elevation={1}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} className="grid-outer">
          <Grid size="auto" className="grid-title">
            <h1 className="text-lg font-semibold">
              All Monitoring Points Page
            </h1>
          </Grid>
          <Grid size="auto" className="grid-controls">
            <FormContainer table="allMonitoringPoints" type="create" />
          </Grid>
        </Grid>
      </Box>
      <Grid className="table-container">
        <Table columns={columns} renderRow={renderRow} data={data} />
      </Grid>
      <div className="mt-5">
        <PaginationButton count={count} />
      </div>
    </Paper>
  );
};

export default MonitoringPointListWithSensorsPage;
