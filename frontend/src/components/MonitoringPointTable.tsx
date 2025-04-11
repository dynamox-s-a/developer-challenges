import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  CircularProgress,
  IconButton,
  Tooltip,
  Box,
  Typography,
} from "@mui/material";
import { Plus, Edit, Trash, AlertCircle } from "lucide-react";
import { MonitoringPoint, MachineType, SensorModel } from "../services/api";

interface MonitoringPointTableProps {
  monitoringPoints: MonitoringPoint[];
  loading: boolean;
  page: number;
  rowsPerPage: number;
  orderBy: string | null;
  order: "asc" | "desc";
  totalCount: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRequestSort: (property: string) => void;
  onAddSensor: (point: MonitoringPoint) => void;
  onEdit: (point: MonitoringPoint) => void;
  onDelete: (point: MonitoringPoint) => void;
}

const MonitoringPointTable: React.FC<MonitoringPointTableProps> = ({
  monitoringPoints,
  loading,
  page,
  rowsPerPage,
  orderBy,
  order,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
  onRequestSort,
  onAddSensor,
  onEdit,
  onDelete,
}) => {
  const createSortHandler = (property: string) => () => {
    onRequestSort(property);
  };

  return (
    <TableContainer component={Paper} elevation={1}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={orderBy === "id"}
                direction={orderBy === "id" ? order : "asc"}
                onClick={createSortHandler("id")}
              >
                ID
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "name"}
                direction={orderBy === "name" ? order : "asc"}
                onClick={createSortHandler("name")}
              >
                Nome do ponto
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "machine.name"}
                direction={orderBy === "machine.name" ? order : "asc"}
                onClick={createSortHandler("machine.name")}
              >
                Nome da máquina
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "machine.type"}
                direction={orderBy === "machine.type" ? order : "asc"}
                onClick={createSortHandler("machine.type")}
              >
                Tipo da máquina
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "sensor.model"}
                direction={orderBy === "sensor.model" ? order : "asc"}
                onClick={createSortHandler("sensor.model")}
              >
                Modelo do sensor
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                <CircularProgress size={30} />
              </TableCell>
            </TableRow>
          ) : monitoringPoints.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <AlertCircle size={24} />
                  <Typography>
                    Nenhum ponto de monitoramento encontrado
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            monitoringPoints.map((point) => (
              <TableRow key={point.id}>
                <TableCell>{point.id}</TableCell>
                <TableCell>{point.name}</TableCell>
                <TableCell>{point.machine?.name}</TableCell>
                <TableCell>{point.machine?.type}</TableCell>
                <TableCell>
                  {point.sensor ? point.sensor.model : "No Sensor"}
                </TableCell>
                <TableCell align="right">
                  {!point.sensor && (
                    <Tooltip title="Adicionar">
                      <IconButton
                        color="success"
                        onClick={() => onAddSensor(point)}
                      >
                        <Plus size={18} />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Editar">
                    <IconButton
                      color="primary"
                      onClick={() => onEdit(point)}
                    >
                      <Edit size={18} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Deletar">
                    <IconButton
                      color="error"
                      onClick={() => onDelete(point)}
                    >
                      <Trash size={18} />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </TableContainer>
  );
};

export default MonitoringPointTable;