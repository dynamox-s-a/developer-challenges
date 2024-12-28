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
import {
  NOTIFICATION_DURATION,
  NOTIFICATION_MESSAGES,
} from "@/constants/machines";

/**
 * Type representing a monitoring point.
 */
type MonitoringPoint = {
  id?: string;
  machineId: string;
  name: string;
  machineName: string;
  machineType: "Pump" | "Fan";
  sensorId: string;
  sensor: { name: string };
};

/**
 * Type representing the keys of the MonitoringPoint type.
 */
type MonitoringPointKey = keyof MonitoringPoint;

/**
 * Component displaying a list of monitoring points in a table with sorting, pagination, and delete functionality.
 * @returns {JSX.Element} The rendered component.
 */
const MonitoringPointsList = () => {
  const dispatch = useAppDispatch();
  const { machines, sensors } = useAppSelector((state) => state.machines);
  const { notification, showNotification, hideNotification } =
    useNotification();

  // Get sensor name from sensors array
  const getSensorName = (sensorId: string) => {
    const sensor = sensors.find((s) => s.id === sensorId);
    return sensor ? sensor.name : sensorId;
  };

  // Flatten the monitoring points data from the machines state
  const monitoringPoints = machines.flatMap((machine) =>
    machine.monitoringPoints?.map((mp) => ({
      ...mp,
      machineId: machine.id,
      machineName: machine.name,
      machineType: machine.type,
      sensorName: getSensorName(mp.sensorId),
    })),
  );


  // State for table pagination and sorting
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<MonitoringPointKey>("name");

  /**
   * Handles sorting of the table columns.
   * @param {MonitoringPointKey} property The property to sort by.
   */
  const handleRequestSort = (property: MonitoringPointKey) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  /**
   * Handles the change in the current page of the table.
   * @param {number} newPage The new page number.
   */
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  /**
   * Handles the change in the number of rows per page for pagination.
   * @param {React.ChangeEvent<HTMLInputElement>} event The event that triggered the rows per page change.
   */
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  /**
   * Sorts the monitoring points by the selected column and order.
   * @returns {MonitoringPoint[]} The sorted array of monitoring points.
   */
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

  /**
   * Handles the deletion of a monitoring point.
   * @param {string} machineId The ID of the machine.
   * @param {string} monitoringPointId The ID of the monitoring point to delete.
   */
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
      showNotification(NOTIFICATION_MESSAGES.OPERATION_ERROR, "error");
    }
  };

  return (
    <>
      <Card variant="outlined">
        <Box sx={{}}>
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
                                    mp.machineId!,
                                    mp.id!,
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
              <Divider />
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={monitoringPoints.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
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
