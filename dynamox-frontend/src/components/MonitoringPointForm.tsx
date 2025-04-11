import { Box, Button, MenuItem, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  createMonitoringPoint,
  updateMonitoringPoint,
} from "../store/monitoring-point/monitoringPointThunks";
import { fetchMachines } from "../store/machines/machineThunks";
import { fetchSensors } from "../store/sensors/sensorThunks";
import { Machine } from "../store/machines/machineTypes";
import {
  SensorModelType,
  DisplaySensorModel,
  toDisplayModel,
  toInternalModel,
} from "../store/sensors/sensorTypes";

interface MonitoringPointFormProps {
  initialData?: {
    id: string;
    name: string;
    machineId: string;
    sensorModel: SensorModelType;
  };
  onSuccess?: () => void;
}

const MonitoringPointForm: React.FC<MonitoringPointFormProps> = ({ initialData, onSuccess }) => {
  const dispatch = useAppDispatch();

  const machines = useAppSelector((state) => state.machines.items);
  const machineStatus = useAppSelector((state) => state.machines.status);

  const sensorModels = useAppSelector((state) => state.sensors.items);
  const sensorStatus = useAppSelector((state) => state.sensors.status);

  const [name, setName] = useState(initialData?.name || "");
  const [machineId, setMachineId] = useState(initialData?.machineId || "");
  const [sensorModel, setSensorModel] = useState<SensorModelType>(
    initialData?.sensorModel || "TcAg"
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setMachineId(initialData.machineId);
      setSensorModel(initialData.sensorModel);
    }
  }, [initialData]);

  useEffect(() => {
    if (machineStatus === "idle") {
      dispatch(fetchMachines());
    }
  }, [dispatch, machineStatus]);

  useEffect(() => {
    if (sensorStatus === "idle") {
      dispatch(fetchSensors());
    }
  }, [dispatch, sensorStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !machineId || !sensorModel) {
      setError("Todos os campos são obrigatórios.");
      return;
    }

    const machine: Machine | undefined = machines.find((m) => m.id === machineId);

    if (machine?.type === "Pump" && (sensorModel === "TcAg" || sensorModel === "TcAs")) {
      setError("Sensores TcAg e TcAs não podem ser usados em máquinas do tipo Pump.");
      return;
    }

    if (initialData) {
      const result = await dispatch(
        updateMonitoringPoint({
          id: initialData.id,
          name,
          machineId,
          sensorModel,
        })
      );

      if (updateMonitoringPoint.rejected.match(result)) {
        setError(result.payload || "Erro ao atualizar ponto.");
      } else {
        onSuccess?.();
      }
    } else {
      const result = await dispatch(createMonitoringPoint({ name, machineId, sensorModel }));

      if (createMonitoringPoint.rejected.match(result)) {
        setError(result.payload || "Erro ao criar ponto.");
      } else {
        setName("");
        setMachineId("");
        setSensorModel("TcAg");
        onSuccess?.();
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} mb={4}>
      <Typography variant="h6" gutterBottom>
        {initialData ? "Editar Ponto de Monitoramento" : "Novo Ponto de Monitoramento"}
      </Typography>

      <TextField
        label="Nome do Ponto"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
      />

      <TextField
        select
        label="Máquina"
        value={machineId}
        onChange={(e) => setMachineId(e.target.value)}
        fullWidth
        margin="normal"
      >
        {machines.map((machine) => (
          <MenuItem key={machine.id} value={machine.id}>
            {machine.name} ({machine.type})
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Modelo do Sensor"
        value={toDisplayModel(sensorModel)}
        onChange={(e) => {
          setSensorModel(toInternalModel(e.target.value as DisplaySensorModel));
          console.log(sensorModel);
        }}
        fullWidth
        margin="normal"
      >
        {sensorModels.map((model) => (
          <MenuItem key={model} value={toDisplayModel(model)}>
            {toDisplayModel(model)}
          </MenuItem>
        ))}
      </TextField>

      {error && <Typography color="error">{error}</Typography>}

      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        {initialData ? "Atualizar Ponto" : "Criar Ponto"}
      </Button>
    </Box>
  );
};

export default MonitoringPointForm;
