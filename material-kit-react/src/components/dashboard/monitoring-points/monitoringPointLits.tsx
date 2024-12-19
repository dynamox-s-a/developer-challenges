"use client";
import React, { useState } from "react";
// import { useDispatch } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Card,
  CardHeader,
  Divider,
  Tooltip,
  Typography,
  Box,
  TablePagination,
} from "@mui/material";
import { Trash } from "@phosphor-icons/react";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { deleteMonitoringPoint } from "../redux/machinesSlice";
// import { useAppSelector } from "@/store/store";

const mockMachines = [
  {
    id: "1",
    name: "Pump 1",
    type: "Pump",
    monitoringPoints: [
      { id: "mp1", name: "Point A", sensor: { id: "s1", model: "TcAg" } },
      { id: "mp2", name: "Point B", sensor: { id: "s2", model: "TcAs" } },
    ],
  },
  {
    id: "2",
    name: "Fan 1",
    type: "Fan",
    monitoringPoints: [
      { id: "mp3", name: "Point C", sensor: { id: "s3", model: "HF+" } },
    ],
  },
  {
    id: "2",
    name: "Fan 1",
    type: "Fan",
    monitoringPoints: [
      { id: "mp3", name: "Point C", sensor: { id: "s3", model: "HF+" } },
    ],
  },
  {
    id: "2",
    name: "Fan 1",
    type: "Fan",
    monitoringPoints: [
      { id: "mp3", name: "Point C", sensor: { id: "s3", model: "HF+" } },
    ],
  },
  {
    id: "2",
    name: "Fan 1",
    type: "Fan",
    monitoringPoints: [
      { id: "mp3", name: "Point C", sensor: { id: "s3", model: "HF+" } },
    ],
  },
];
const MonitoringPointsList = () => {
  // const dispatch = useDispatch();
  const monitoringPoints = mockMachines.flatMap((machine) =>
    machine.monitoringPoints.map((mp) => ({
      ...mp,
      machineId: machine.id,
      machineName: machine.name,
      machineType: machine.type,
    })),
  );

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] =
    useState<keyof (typeof monitoringPoints)[0]>("name");

  const handleRequestSort = (property: keyof (typeof monitoringPoints)[0]) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = (machineId: string, monitoringPointId: string) => {
    // dispatch(deleteMonitoringPoint({ machineId, monitoringPointId }));
  };

  const sortedMonitoringPoints = [...monitoringPoints].sort((a, b) => {
    if (
      orderBy === "name" ||
      orderBy === "machineName" ||
      orderBy === "machineType"
    ) {
      return order === "asc"
        ? a[orderBy].localeCompare(b[orderBy])
        : b[orderBy].localeCompare(a[orderBy]);
    }
    return 0;
  });

  return (
    <Card variant="outlined" sx={{ flex: 1, boxShadow: 3 }}>
      <CardHeader
        title="Monitoring Points"
        sx={{
          fontWeight: 600,
          fontSize: "1.5rem",
        }}
      />
      <Divider />
      <Box sx={{ overflowX: "auto", minHeight: 200 }}>
        {monitoringPoints.length > 0 ? (
          <>
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      onClick={() => handleRequestSort("name")}
                      sx={{
                        cursor: "pointer",
                        fontWeight: "bold",
                        color: "text.primary",
                      }}
                    >
                      Monitoring Point Name
                    </TableCell>
                    <TableCell
                      onClick={() => handleRequestSort("machineName")}
                      sx={{
                        cursor: "pointer",
                        fontWeight: "bold",
                        color: "text.primary",
                      }}
                    >
                      Machine Name
                    </TableCell>
                    <TableCell
                      onClick={() => handleRequestSort("machineType")}
                      sx={{
                        cursor: "pointer",
                        fontWeight: "bold",
                        color: "text.primary",
                      }}
                    >
                      Machine Type
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Sensor Model
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedMonitoringPoints
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((point) => (
                      <TableRow key={point.id}>
                        <TableCell>{point.name}</TableCell>
                        <TableCell>{point.machineName}</TableCell>
                        <TableCell>{point.machineType}</TableCell>
                        <TableCell>
                          {point.sensor ? point.sensor.model : "N/A"}
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Delete">
                            <IconButton
                              color="error"
                              onClick={() =>
                                handleDelete(point.machineId, point.id)
                              }
                              sx={{
                                "&:hover": {
                                  backgroundColor: "rgba(255, 0, 0, 0.1)",
                                },
                              }}
                            >
                              <Trash />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={monitoringPoints.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                marginTop: "1rem",
                display: "flex",
                justifyContent: "flex-end",
              }}
            />
          </>
        ) : (
          <Box sx={{ textAlign: "center", p: 2 }}>
            <Typography color="text.secondary">
              There are no monitoring points yet!
            </Typography>
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default MonitoringPointsList;
