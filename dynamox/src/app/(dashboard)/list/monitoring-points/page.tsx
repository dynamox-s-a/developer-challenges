import * as React from "react";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import PaginationButton from "@/src/components/Pagination";
import Table from "@/src/components/Table";
import { TableCell, TableRow } from "@mui/material";
import { MonitoringPoint, Machine } from "@prisma/client";
import prisma from "@/src/lib/prisma";
import { ITEMS_PER_PAGE } from "@/src/constants";
import FormContainer from "@/src/components/FormContainer";

type MonitoringPointList = MonitoringPoint & { machine: Machine };

const columns = [
  { header: "Monitoring Point Name", accessor: "name" },
  { header: "Machine Name", accessor: "machineName" },
  { header: "Machine Type", accessor: "machineType" },
];

const renderRow = (item: MonitoringPointList) => (
  <TableRow key={item.id}>
    <TableCell>{item.name}</TableCell>
    <TableCell>{item.machine.name}</TableCell>
    <TableCell>{item.machine.type}</TableCell>
  </TableRow>
);

const MonitoringPointListPage = async ({
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
            <h1 className="text-lg font-semibold">All Monitoring Points</h1>
          </Grid>
          <Grid size="auto" className="grid-controls">
            <FormContainer table="monitoringPoint" type="create" />
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

export default MonitoringPointListPage;
