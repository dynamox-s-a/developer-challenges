import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store";
import { createSensor, updateSensor } from "../store/sensors/sensorThunks";
import { Sensor, CreateSensorDTO } from "../store/sensors/sensorTypes";
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  Paper,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { fetchMonitoringPoints } from "../store/monitoring-point/monitoringPointThunks";

interface SensorFormProps {
  editingSensor?: Sensor;
  onFinishEdit?: () => void;
}

export const MonitoringPointSelect = ({
  value,
  onChange,
}: {
  value: number | "";
  onChange: (e: any) => void;
}) => {
  const dispatch = useAppDispatch();
  const { items: monitoringPoints, loading } = useAppSelector((state) => state.monitoringPoints);

  useEffect(() => {
    dispatch(fetchMonitoringPoints());
  }, [dispatch]);

  return (
    <FormControl fullWidth>
      <InputLabel id="monitoring-point-select-label">Ponto de Monitoramento</InputLabel>
      <Select
        labelId="monitoring-point-select-label"
        value={value}
        onChange={onChange}
        disabled={loading}
      >
        {Array.isArray(monitoringPoints) &&
          monitoringPoints.map((point: any) => (
            <MenuItem key={point.id} value={point.id}>
              {point.name}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};

const SensorForm = ({ editingSensor, onFinishEdit }: SensorFormProps) => {
  const dispatch = useAppDispatch();

  const [model, setModel] = useState<Sensor["model"]>(editingSensor?.model || "TcAg");
  const [monitoringPointId, setMonitoringPointId] = useState<number | null>(
    editingSensor?.monitoringPointId ?? null
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!monitoringPointId) {
      alert("Selecione um ponto de monitoramento");
      return;
    }

    const sensorData: CreateSensorDTO = {
      name: editingSensor?.name || "Sensor Padrão",
      model,
      monitoringPointId,
      machineId: editingSensor?.machineId || 1,
    };

    if (editingSensor) {
      dispatch(updateSensor({ ...sensorData, id: editingSensor.id }))
        .unwrap()
        .then(() => {
          onFinishEdit?.();
        })
        .catch(console.error);
    } else {
      dispatch(createSensor(sensorData))
        .unwrap()
        .then(() => {
          setModel("TcAg");
          setMonitoringPointId(null);
        })
        .catch(console.error);
    }
  };

  return (
    <Paper sx={{ padding: 2, marginBottom: 2 }}>
      <Typography variant="h6" gutterBottom>
        {editingSensor ? "Editar Sensor" : "Novo Sensor"}
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          select
          label="Modelo do Sensor"
          value={model}
          onChange={(e) => setModel(e.target.value as Sensor["model"])}
          fullWidth
          required
        >
          <MenuItem value="TcAg">TcAg</MenuItem>
          <MenuItem value="TcAs">TcAs</MenuItem>
          <MenuItem value="HF_Plus">HF+</MenuItem>
        </TextField>

        <MonitoringPointSelect
          value={monitoringPointId ?? ""}
          onChange={(e) => setMonitoringPointId(Number(e.target.value))}
        />

        <Button type="submit" variant="contained">
          {editingSensor ? "Atualizar" : "Cadastrar"}
        </Button>
      </Box>
    </Paper>
  );
};

export default SensorForm;
