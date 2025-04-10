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
  TextField,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { MonitoringPoint } from "../store/monitoring-point/monitoringPointTypes";
import {
  deleteMonitoringPoint,
  updateMonitoringPoint,
} from "../store/monitoring-point/monitoringPointThunks";

interface Props {
  points: MonitoringPoint[];
}

type Order = "asc" | "desc";

const MonitoringPointTable = ({ points }: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  const machines = useSelector((state: RootState) => state.machines.items);
  const sensors = useSelector((state: RootState) => state.sensors.items);

  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<
    keyof MonitoringPoint | "machine.name" | "machine.type" | "sensor.model"
  >("name");
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  const [editedMachineId, setEditedMachineId] = useState("");
  const [editedSensorModel, setEditedSensorModel] = useState("");

  const [editId, setEditId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");

  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const startEdit = (point: MonitoringPoint) => {
    setEditId(point.id);
    setEditedName(point.name);
    setEditedMachineId(point.machineId);
    setEditedSensorModel(point.sensor?.model || "");
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditedName("");
    setEditedMachineId("");
    setEditedSensorModel("");
  };

  const saveEdit = () => {
    if (editId !== null) {
      dispatch(
        updateMonitoringPoint({
          id: editId,
          name: editedName,
          machineId: editedMachineId,
          sensorModel: editedSensorModel,
        })
      );
      setEditId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Deseja realmente excluir este ponto de monitoramento?")) {
      setDeletingId(id);
      try {
        await dispatch(deleteMonitoringPoint(id)).unwrap();
      } catch (err) {
        console.error("Falha ao excluir:", err);
      } finally {
        setDeletingId(null);
      }
    }
  };

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
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedPoints.map((point) => (
            <TableRow key={point.id}>
              <TableCell>
                {editId === point.id ? (
                  <TextField
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    size="small"
                  />
                ) : (
                  point.name
                )}
              </TableCell>
              <TableCell>
                {editId === point.id ? (
                  <Select
                    value={editedMachineId}
                    onChange={(e) => setEditedMachineId(e.target.value)}
                    size="small"
                    fullWidth
                  >
                    {machines.map((machine) => (
                      <MenuItem key={machine.id} value={machine.id}>
                        {machine.name}
                      </MenuItem>
                    ))}
                  </Select>
                ) : (
                  point.machine?.name
                )}
              </TableCell>
              <TableCell>
                {editId === point.id
                  ? machines.find((m) => m.id === editedMachineId)?.type || ""
                  : point.machine?.type}
              </TableCell>
              <TableCell>
                {editId === point.id ? (
                  <Select
                    value={editedSensorModel}
                    onChange={(e) => setEditedSensorModel(e.target.value)}
                    size="small"
                    fullWidth
                  >
                    {sensors.map((sensor) => (
                      <MenuItem key={sensor.id} value={sensor.model}>
                        {sensor.model}
                      </MenuItem>
                    ))}
                  </Select>
                ) : point.sensor?.model === "HF_Plus" ? (
                  "HF+"
                ) : (
                  point.sensor?.model
                )}
              </TableCell>
              <TableCell align="right">
                {editId === point.id ? (
                  <>
                    <Button variant="contained" size="small" onClick={saveEdit} sx={{ mr: 1 }}>
                      Salvar
                    </Button>
                    <Button variant="outlined" size="small" onClick={cancelEdit}>
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ mr: 1 }}
                      onClick={() => startEdit(point)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={() => handleDelete(point.id)}
                      disabled={deletingId === point.id}
                    >
                      {deletingId === point.id ? "Excluindo..." : "Excluir"}
                    </Button>
                  </>
                )}
              </TableCell>
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
