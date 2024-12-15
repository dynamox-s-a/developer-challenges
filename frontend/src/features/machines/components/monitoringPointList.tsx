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
  Button,
  Typography,
} from "@mui/material";
import { deleteMonitoringPoint } from "../redux/machinesSlice";
import { useAppSelector } from "@/store/store";
import styled from "styled-components";

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
`;

const TableHeaderCell = styled(TableCell)`
  font-weight: 600;
`;

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
  const [orderBy, setOrderBy] = useState<string>("name");

  const handleRequestSort = (property: string) => {
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

  const sortedMonitoringPoints = monitoringPoints.sort((a, b) => {
    if (orderBy === "name") {
      return order === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    return 0;
  });

  return (
    <ListContainer>
      {monitoringPoints.length === 0 ? (
        <Typography variant="h6" color="textSecondary">
          There are no monitoring points yet!
        </Typography>
      ) : (
        <>
          <TableContainer
            sx={{
              boxShadow: 3,
              borderRadius: 2,
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell onClick={() => handleRequestSort("name")}>
                    Monitoring Point Name
                  </TableHeaderCell>
                  <TableHeaderCell
                    onClick={() => handleRequestSort("machineName")}
                  >
                    Machine Name
                  </TableHeaderCell>
                  <TableHeaderCell
                    onClick={() => handleRequestSort("machineType")}
                  >
                    Machine Type
                  </TableHeaderCell>
                  <TableHeaderCell
                    onClick={() => handleRequestSort("sensorModel")}
                  >
                    Sensor Model
                  </TableHeaderCell>
                  <TableHeaderCell>Actions</TableHeaderCell>
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
                        <Button
                          variant="contained"
                          color="error"
                          sx={{
                            margin: "0 0.5rem",
                            textTransform: "capitalize",
                          }}
                          onClick={() =>
                            handleDelete(point.machineId, point.id)
                          }
                        >
                          Delete
                        </Button>
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
              borderTop: "1px solid #ccc",
            }}
          />
        </>
      )}
    </ListContainer>
  );
};

export default MonitoringPointsList;
