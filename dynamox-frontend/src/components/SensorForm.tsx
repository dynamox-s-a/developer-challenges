import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector, useAppDispatch } from "../store";
import { createSensor, updateSensor } from "../store/sensors/sensorThunks";
import { Sensor } from "../store/sensors/sensorTypes";
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
  value: string;
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
        {monitoringPoints.map((point: any) => (
          <MenuItem key={point.id} value={point.id}>
            {point.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const SensorForm = ({ editingSensor, onFinishEdit }: SensorFormProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [model, setModel] = useState<Sensor["model"]>(editingSensor?.model || "TcAg");
  const [monitoringPointId, setMonitoringPointId] = useState<number>(
    editingSensor?.monitoringPointId || 0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const sensorData = {
      name: editingSensor?.name || "Sensor Padrão",
      model,
      monitoringPointId,
      machineId: editingSensor?.machineId || 1,
    };

    const action = editingSensor
      ? updateSensor({ ...sensorData, id: editingSensor.id })
      : createSensor(sensorData);

    dispatch(action)
      .unwrap()
      .then(() => {
        if (editingSensor) {
          onFinishEdit?.();
        } else {
          setModel("TcAg");
          setMonitoringPointId(0);
        }
      })
      .catch(console.error);
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
          value={monitoringPointId.toString()}
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
