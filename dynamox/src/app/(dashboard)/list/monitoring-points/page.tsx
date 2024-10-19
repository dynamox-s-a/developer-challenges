import TableSearch from "@/src/components/TableSearch";
import * as React from "react";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import ButtonStack from "@/src/components/ButtonStack";
import PaginationButton from "@/src/components/Pagination";
import Table from "@/src/components/Table";
import { Stack, TableCell, TableRow } from "@mui/material";
import { MonitoringPoint, Machine } from "@prisma/client";
import prisma from "@/src/lib/prisma";
import { ITEMS_PER_PAGE } from "@/src/constants";
import FormContainer from "@/src/components/FormContainer";

type MonitoringPointList = MonitoringPoint & { machine: Machine };

const MonitoringPointListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string } | undefined;
}) => {
  const columns = [
    { header: "Monitoring Point Name", accessor: "name" },
    { header: "Machine Name", accessor: "machine" },
    { header: "Machine Type", accessor: "machineType" },
    { header: "Actions", accessor: "action" },
  ];

  const renderRow = (item: MonitoringPointList) => (
    <TableRow key={item.id}>
      <TableCell>{item.name}</TableCell>
      <TableCell>{item.machine.name}</TableCell>
      <TableCell>{item.machine.type}</TableCell>

      <TableCell sx={{ width: "100px" }}>
        <Stack direction="row" spacing={1}>
          <FormContainer
            table="monitoringPoint"
            type="update"
            data={item}
            id={item.id}
          />
          <FormContainer
            table="monitoringPoint"
            type="delete"
            data={item}
            id={item.id}
          />
        </Stack>
      </TableCell>
    </TableRow>
  );

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
    <Paper square={false} elevation={1} sx={{ p: 4, flex: 1, m: 4, mt: 0 }}>
      <div>
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={2}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Grid size="auto" sx={{ display: { xs: "none", md: "block" } }}>
              <h1 className="text-lg font-semibold">All Monitoring Points</h1>
            </Grid>
            <Grid
              size="auto"
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: "center",
                gap: 2,
                width: { xs: "100%", md: "auto" },
              }}
            >
              <TableSearch />
              <ButtonStack />
              <FormContainer table="monitoringPoint" type="create" />
            </Grid>
          </Grid>
        </Box>
        <div className="mt-10">
          <Table columns={columns} renderRow={renderRow} data={data} />
        </div>
        <div className="mt-5">
          <PaginationButton count={count} />
        </div>
      </div>
    </Paper>
  );
};

export default MonitoringPointListPage;
