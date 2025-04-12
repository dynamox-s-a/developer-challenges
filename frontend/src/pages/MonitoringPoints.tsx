import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  CircularProgress,
  Tooltip,
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
import MonitoringPointDialog from "../components/MonitoringPointDialog";
import MonitoringPointTable from "../components/MonitoringPointTable";
import AddSensorDialog from "../components/AddSensorDialog";
import DeleteMonitoringPointDialog from "../components/DeleteMonitoringPointDialog";

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

      <MonitoringPointTable
        monitoringPoints={monitoringPoints}
        loading={loading}
        page={page}
        rowsPerPage={rowsPerPage}
        orderBy={orderBy}
        order={order}
        totalCount={100} 
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        onRequestSort={handleRequestSort}
        onAddSensor={handleOpenSensorDialog}
        onEdit={handleOpenDialog}
        onDelete={handleOpenDeleteDialog}
      />

      <MonitoringPointDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSubmit={handlePointSubmit}
        formData={pointFormData}
        machines={machines}
        onFormChange={handlePointFormChange}
        onMachineChange={handleMachineSelectChange}
      />

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
            {currentPoint?.name}"? 
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
