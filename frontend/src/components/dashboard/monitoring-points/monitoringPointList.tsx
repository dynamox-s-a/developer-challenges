"use client";
import React, { useState } from "react";
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
  Snackbar,
  Alert,
} from "@mui/material";
import { Trash } from "@phosphor-icons/react";
import { useAppDispatch, useAppSelector } from "@/types/hooks";
import { deleteMonitoringPointThunk } from "@/redux/machines/thunks";
import { useNotification } from "@/hooks/use-notifications";
import { NOTIFICATION_DURATION, NOTIFICATION_MESSAGES } from "@/constants/machines";

type MonitoringPoint = {
  id?: string;
  machineId: string;
  name: string;
  machineName: string;
  machineType: "Pump" | "Fan";
  sensorId: string;
  sensor: { name: string };
};

type MonitoringPointKey = keyof MonitoringPoint;

const MonitoringPointsList = () => {
  const dispatch = useAppDispatch();
  const machines = useAppSelector((state) => state.machines.machines);
  const { notification, showNotification, hideNotification } =
    useNotification();

  const monitoringPoints = machines.flatMap((machine) =>
    machine.monitoringPoints?.map((mp) => ({
      ...mp,
      machineId: machine.id,
      machineName: machine.name,
      machineType: machine.type,
      sensorName: mp.sensor?.name,
    })),
  );

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<MonitoringPointKey>("name");

  const handleRequestSort = (property: MonitoringPointKey) => {
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

  const sortedMonitoringPoints = [...monitoringPoints]
    .filter((point) => point !== undefined)
    .sort((a, b) => {
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

  const handleDeleteMonitoringPoint = async (
    machineId: string,
    monitoringPointId: string,
  ) => {
    try {
      await dispatch(
        deleteMonitoringPointThunk({ machineId, monitoringPointId }),
      ).unwrap();
      showNotification(NOTIFICATION_MESSAGES.DELETE_MP_SUCCESS, "success");
    } catch (error) {
      showNotification(NOTIFICATION_MESSAGES.DELETE_ERROR, "error");
    }
  };

  return (
    <>
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
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage,
                      )
                      .map((mp) => (
                        <TableRow key={mp.id}>
                          <TableCell>{mp.name}</TableCell>
                          <TableCell>{mp.machineName}</TableCell>
                          <TableCell>{mp.machineType}</TableCell>
                          <TableCell>{mp.sensorName}</TableCell>
                          <TableCell>
                            <Tooltip title="Delete">
                              <IconButton
                                color="error"
                                onClick={() =>
                                  handleDeleteMonitoringPoint(
                                    mp.machineId,
                                    mp.id,
                                  )
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
      <Snackbar
        open={notification.open}
        autoHideDuration={NOTIFICATION_DURATION}
        onClose={hideNotification}
      >
        <Alert
          onClose={hideNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MonitoringPointsList;
