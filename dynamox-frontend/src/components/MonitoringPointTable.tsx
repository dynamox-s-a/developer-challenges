import { useState, useMemo } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableContainer,
  TableSortLabel,
  TablePagination,
} from "@mui/material";
import { MonitoringPoint } from "../store/monitoring-point/monitoringPointTypes";

interface Props {
  points: MonitoringPoint[];
}

type Order = "asc" | "desc";

const MonitoringPointTable = ({ points }: Props) => {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<
    keyof MonitoringPoint | "machine.name" | "machine.type" | "sensor.model"
  >("name");
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  const handleSort = (property: typeof orderBy) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const sortedPoints = useMemo(() => {
    const compare = (a: MonitoringPoint, b: MonitoringPoint) => {
      let aValue: string | undefined = "";
      let bValue: string | undefined = "";

      switch (orderBy) {
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "machine.name":
          aValue = a.machine?.name;
          bValue = b.machine?.name;
          break;
        case "machine.type":
          aValue = a.machine?.type;
          bValue = b.machine?.type;
          break;
        case "sensor.model":
          aValue = a.sensor?.model;
          bValue = b.sensor?.model;
          break;
      }

      return (
        (aValue || "").localeCompare(bValue || "", undefined, {
          sensitivity: "base",
        }) * (order === "asc" ? 1 : -1)
      );
    };

    return [...points].sort(compare);
  }, [points, order, orderBy]);

  const paginatedPoints = useMemo(() => {
    return sortedPoints.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedPoints, page]);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sortDirection={orderBy === "name" ? order : false}>
              <TableSortLabel
                active={orderBy === "name"}
                direction={orderBy === "name" ? order : "asc"}
                onClick={() => handleSort("name")}
              >
                Nome do Ponto
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={orderBy === "machine.name" ? order : false}>
              <TableSortLabel
                active={orderBy === "machine.name"}
                direction={orderBy === "machine.name" ? order : "asc"}
                onClick={() => handleSort("machine.name")}
              >
                Nome da Máquina
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={orderBy === "machine.type" ? order : false}>
              <TableSortLabel
                active={orderBy === "machine.type"}
                direction={orderBy === "machine.type" ? order : "asc"}
                onClick={() => handleSort("machine.type")}
              >
                Tipo da Máquina
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={orderBy === "sensor.model" ? order : false}>
              <TableSortLabel
                active={orderBy === "sensor.model"}
                direction={orderBy === "sensor.model" ? order : "asc"}
                onClick={() => handleSort("sensor.model")}
              >
                Modelo do Sensor
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedPoints.map((point) => (
            <TableRow key={point.id}>
              <TableCell>{point.name}</TableCell>
              <TableCell>{point.machine?.name}</TableCell>
              <TableCell>{point.machine?.type}</TableCell>
              <TableCell>{point.sensor?.model}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={points.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5]}
      />
    </TableContainer>
  );
};

export default MonitoringPointTable;
