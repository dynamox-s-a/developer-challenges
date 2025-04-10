import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  CircularProgress,
  Tooltip,
  TablePagination,
  TableSortLabel,
} from "@mui/material";
import { Plus, Edit, Trash, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {
  createMonitoringPoint,
  createSensor,
  deleteMonitoringPoint,
  getMachines,
  getMonitoringPoints,
  Machine,
  MachineType,
  MonitoringPoint,
  PaginationOptions,
  SensorModel,
  updateMonitoringPoint,
} from "../services/api";

export default function MonitoringPoints() {
  const [monitoringPoints, setMonitoringPoints] = useState<MonitoringPoint[]>(
    [],
  );
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSensorDialog, setOpenSensorDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentPoint, setCurrentPoint] = useState<MonitoringPoint | null>(
    null,
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState<string | null>(null);
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const [pointFormData, setPointFormData] = useState({
    name: "",
    machineId: 0,
  });

  const [sensorFormData, setSensorFormData] = useState({
    model: SensorModel.HFPlus,
  });

  const fetchMonitoringPoints = async () => {
    try {
      setLoading(true);
      const options: PaginationOptions = {
        page: page + 1,
        limit: rowsPerPage,
      };

      if (orderBy) {
        options.sortBy = orderBy;
        options.sortOrder = order;
      }

      const data = await getMonitoringPoints(options);
      setMonitoringPoints(data);
    } catch (error) {
      console.error("Failed to fetch monitoring points:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMachines = async () => {
    try {
      const data = await getMachines();
      setMachines(data);
    } catch (error) {
      console.error("Failed to fetch machines:", error);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  useEffect(() => {
    fetchMonitoringPoints();
  }, [page, rowsPerPage, orderBy, order]);

  const handleOpenDialog = (point?: MonitoringPoint) => {
    if (point) {
      setCurrentPoint(point);
      setPointFormData({
        name: point.name,
        machineId: point.machineId,
      });
    } else {
      setCurrentPoint(null);
      setPointFormData({
        name: "",
        machineId: machines.length > 0 ? machines[0].id : 0,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenSensorDialog = (point: MonitoringPoint) => {
    setCurrentPoint(point);
    setSensorFormData({
      model: SensorModel.HFPlus,
    });
    setOpenSensorDialog(true);
  };

  const handleCloseSensorDialog = () => {
    setOpenSensorDialog(false);
  };

  const handleOpenDeleteDialog = (point: MonitoringPoint) => {
    setCurrentPoint(point);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handlePointFormChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>,
  ) => {
    const { name, value } = e.target;
    setPointFormData({
      ...pointFormData,
      [name as string]: value,
    });
  };

  const handleMachineSelectChange = (e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    setPointFormData({
      ...pointFormData,
      [name as string]: Number(value),
    });
  };

  const handleSensorModelSelectChange = (e: SelectChangeEvent<SensorModel>) => {
    const { name, value } = e.target;
    setSensorFormData({
      ...sensorFormData,
      [name as string]: value,
    });
  };

  const handlePointSubmit = async () => {
    try {
      if (currentPoint) {
        await updateMonitoringPoint(
          currentPoint.id,
          pointFormData.name,
          pointFormData.machineId as number,
        );
        toast.success("Ponto de monitoramento atualizado com sucesso");
      } else {
        await createMonitoringPoint(
          pointFormData.name,
          pointFormData.machineId as number,
        );
        toast.success("Ponto de monitoramento criado com sucesso");
      }
      handleCloseDialog();
      fetchMonitoringPoints();
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  const handleSensorSubmit = async () => {
    try {
      if (currentPoint) {
        const selectedMachine = machines.find(
          (m) => m.id === currentPoint.machineId,
        );

        if (
          selectedMachine?.type === MachineType.Pump &&
          (sensorFormData.model === SensorModel.TcAg ||
            sensorFormData.model === SensorModel.TcAs)
        ) {
          toast.error(
            "sensores TcAg e TcAs não podem ser utilizados com máquinas Pump",
          );
          return;
        }

        await createSensor(
          sensorFormData.model as SensorModel,
          currentPoint.id,
        );
        toast.success("Sensor adicionado com sucesso");
        handleCloseSensorDialog();
        fetchMonitoringPoints();
      }
    } catch (error) {
      console.error("Erro ao adicionar sensor:", error);
    }
  };

  const handleDelete = async () => {
    try {
      if (currentPoint) {
        await deleteMonitoringPoint(currentPoint.id);
        toast.success("Monitoring point deleted successfully");
        handleCloseDeleteDialog();
        fetchMonitoringPoints();
      }
    } catch (error) {
      console.error("Error deleting monitoring point:", error);
    }
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const createSortHandler = (property: string) => () => {
    handleRequestSort(property);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Pontos de Monitoramento
        </Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={() => handleOpenDialog()}
          disabled={machines.length === 0}
        >
          Adicionar ponto de monitoramento
        </Button>
      </Box>

      {machines.length === 0 && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: "warning.light", color: "white" }}>
          <Typography>
            Você deve criar ao menos uma máquina antes de adicionar um ponto de
            monitoramento.
          </Typography>
        </Paper>
      )}

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
                          onClick={() => handleOpenSensorDialog(point)}
                        >
                          <Plus size={18} />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Editar">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(point)}
                      >
                        <Edit size={18} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Deletar">
                      <IconButton
                        color="error"
                        onClick={() => handleOpenDeleteDialog(point)}
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
          count={100}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {currentPoint ? "Edit Monitoring Point" : "Add New Monitoring Point"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              name="name"
              label="Nome do Ponto"
              type="text"
              fullWidth
              variant="outlined"
              value={pointFormData.name}
              onChange={handlePointFormChange}
              required
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="machine-label">Máquina</InputLabel>
              <Select
                labelId="machine-label"
                id="machineId"
                name="machineId"
                value={pointFormData.machineId || ""}
                label="Machine"
                onChange={handleMachineSelectChange}
              >
                {machines.map((machine) => (
                  <MenuItem key={machine.id} value={machine.id}>
                    {machine.name} ({machine.type})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            onClick={handlePointSubmit}
            variant="contained"
            disabled={!pointFormData.name || !pointFormData.machineId}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openSensorDialog}
        onClose={handleCloseSensorDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Adicionar sensor à {currentPoint?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth margin="dense">
              <InputLabel id="sensor-model-label">Modelo de sensor</InputLabel>
              <Select
                labelId="sensor-model-label"
                id="model"
                name="model"
                value={sensorFormData.model}
                label="Sensor Model"
                onChange={handleSensorModelSelectChange}
              >
                <MenuItem value={SensorModel.HFPlus}>HF+</MenuItem>
                <MenuItem
                  value={SensorModel.TcAg}
                  disabled={
                    machines.find((m) => m.id === currentPoint?.machineId)
                      ?.type === MachineType.Pump
                  }
                >
                  TcAg{" "}
                  {machines.find((m) => m.id === currentPoint?.machineId)
                    ?.type === MachineType.Pump && "(Não compatível com Pump)"}
                </MenuItem>
                <MenuItem
                  value={SensorModel.TcAs}
                  disabled={
                    machines.find((m) => m.id === currentPoint?.machineId)
                      ?.type === MachineType.Pump
                  }
                >
                  TcAs{" "}
                  {machines.find((m) => m.id === currentPoint?.machineId)
                    ?.type === MachineType.Pump && "(Não compatível com Pump)"}
                </MenuItem>
              </Select>
            </FormControl>

            {machines.find((m) => m.id === currentPoint?.machineId)?.type ===
              MachineType.Pump && (
              <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                Atenção: TcAg e TcAs não podem ser utilizados com máquinas do
                tipo Pump
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSensorDialog}>Cancelar</Button>
          <Button onClick={handleSensorSubmit} variant="contained">
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Deletar</DialogTitle>
        <DialogContent>
          <Typography>
            Você tem certeza que deseja deletar o ponto de monitoramento "
            {currentPoint?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Deletar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
