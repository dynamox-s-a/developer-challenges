import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  IconButton,
  Card,
  CardHeader,
  Divider,
  Tooltip,
  Typography,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteMonitoringPoint } from "../redux/machinesSlice";
import { useAppSelector } from "@/store/store";

const MonitoringPointsList = () => {
  const dispatch = useDispatch();

  const monitoringPoints = useAppSelector((state) => {
    return state.machines.machines.flatMap((machine) =>
      machine.monitoringPoints.map((mp) => ({
        ...mp,
        machineId: machine.id,
        machineName: machine.name,
        machineType: machine.type,
      })),
    );
  });

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
    dispatch(deleteMonitoringPoint({ machineId, monitoringPointId }));
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
    <Card variant="outlined" sx={{ flex: 1 }}>
      <CardHeader
        title="Monitoring Points"
        sx={{
          "& .MuiCardHeader-title": { fontWeight: 600, fontSize: "1.5rem" },
        }}
      />
      <Divider />
      <Box sx={{ overflowX: "auto", minHeight: 200 }}>
        {monitoringPoints.length > 0 ? (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell onClick={() => handleRequestSort("name")}>
                      Monitoring Point Name
                    </TableCell>
                    <TableCell onClick={() => handleRequestSort("machineName")}>
                      Machine Name
                    </TableCell>
                    <TableCell onClick={() => handleRequestSort("machineType")}>
                      Machine Type
                    </TableCell>
                    <TableCell>Sensor Model</TableCell>
                    <TableCell>Actions</TableCell>
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
                            >
                              <DeleteIcon />
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
