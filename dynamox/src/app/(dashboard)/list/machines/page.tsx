import TableSearch from "@/src/components/TableSearch";

import * as React from "react";

import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import ButtonStack from "@/src/components/ButtonStack";
import PaginationButton from "@/src/components/Pagination";
import Table from "@/src/components/Table";
import { machinesData } from "@/src/lib/data";
import { TableCell, TableRow } from "@mui/material";

type Machine = {
  id: number;
  name: string;
  type: string;
  sensors: string[];
  monitoringPoints: string[];
};

const columns = [
  { header: "Name", accessor: "name" },
  { header: "ID", accessor: "id" },
  { header: "Type", accessor: "type" },
  { header: "Sensors", accessor: "sensors" },
  { header: "Monitoring Points", accessor: "monitoringPoints" },
];

const MachineListPage = () => {
  const renderRow = (item: Machine) => {
    console.log(item);

    return (
      <TableRow key={item.id}>
        <TableCell>
          <div className="flex flex-col">
            <h3 className="font-semibold">{item.name}</h3>
          </div>
        </TableCell>
        <TableCell>{item.id}</TableCell>
        <TableCell>{item.type}</TableCell>
        <TableCell>{item.sensors.join(", ")}</TableCell>
        <TableCell>{item.monitoringPoints.join(", ")}</TableCell>
      </TableRow>
    );
  };

  return (
    <Paper
      square={false}
      elevation={1}
      sx={{
        p: 4,
        flex: 1,
        m: 4,
        mt: 0,
      }}
    >
      {/* TOP */}
      <div>
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={2}
            sx={{
              display: "flex",
              alignItems: "center",
              // justifyContent: "between",
            }}
          >
            <Grid
              size="auto"
              sx={{
                display: { xs: "none", md: "block" },
              }}
            >
              <h1 className="text-lg font-semibold">All Machines</h1>
            </Grid>

            <Grid
              size="auto"
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: "center",
                gap: 4,
                width: { xs: "100%", md: "auto" },
              }}
            >
              <TableSearch />
              <ButtonStack />
            </Grid>
          </Grid>
        </Box>
        <Table columns={columns} renderRow={renderRow} data={machinesData} />
        <PaginationButton />
      </div>
    </Paper>
  );
};

export default MachineListPage;
