import TableSearch from "@/src/components/TableSearch";

import * as React from "react";

import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import ButtonStack from "@/src/components/ButtonStack";
import PaginationButton from "@/src/components/Pagination";

// type Machine = {
//   id: number;
//   name: string;
//   type: string;
//   sensors: string[];
//   monitoringPoints: string[];
// };

// const columns = [
//   {
//     header: "Info",
//     accessor: "info",
//   },
//   {
//     header: "Machine ID",
//     accessor: "machineId",
//     className: "hidden md:table-cell",
//   },
//   {
//     header: "Type",
//     accessor: "type",
//     className: "hidden md:table-cell",
//   },
//   {
//     header: "Sensors",
//     accessor: "sensors",
//     className: "hidden md:table-cell",
//   },
//   {
//     header: "Monitoring Points",
//     accessor: "monitoringPoints",
//     className: "hidden md:table-cell",
//   },
//   {
//     header: "Actions",
//     accessor: "action",
//   },
// ];

const MachineListPage = () => {
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

        <PaginationButton />
      </div>
    </Paper>
  );
};

export default MachineListPage;
