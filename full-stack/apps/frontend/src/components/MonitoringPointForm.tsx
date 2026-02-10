import { FormControl, InputLabel, MenuItem, Select, TextField, Stack } from "@mui/material";
import type { Machine } from "../api/machines";

type SensorModel = "HF_plus" | "TcAg" | "TcAs";

type MonitoringPointFormProps = {
  data: {
    machineId: string;
    name: string;
    sensorUniqueId: string;
    sensorModel: SensorModel;
  };
  machines: Machine[];
  onChange: (data: MonitoringPointFormProps["data"]) => void;
  disabled?: boolean;
  disableMachine?: boolean;
};

export function MonitoringPointForm({ 
  data, 
  machines, 
  onChange, 
  disabled = false,
  disableMachine = false 
}: MonitoringPointFormProps) {
  return (
    <Stack spacing={2}>
      <FormControl fullWidth disabled={disabled || disableMachine}>
        <InputLabel>Machine</InputLabel>
        <Select
          value={data.machineId}
          label="Machine"
          onChange={(e) => onChange({ ...data, machineId: e.target.value })}
        >
          {machines.map((machine) => (
            <MenuItem key={machine.id} value={machine.id}>
              {machine.name} ({machine.type})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <TextField
        label="Monitoring Point Name"
        value={data.name}
        onChange={(e) => onChange({ ...data, name: e.target.value })}
        disabled={disabled}
        fullWidth
        required
      />
      
      <TextField
        label="Sensor Unique ID"
        value={data.sensorUniqueId}
        onChange={(e) => onChange({ ...data, sensorUniqueId: e.target.value })}
        disabled={disabled}
        fullWidth
        required
      />
      
      <FormControl fullWidth disabled={disabled}>
        <InputLabel>Sensor Model</InputLabel>
        <Select
          value={data.sensorModel}
          label="Sensor Model"
          onChange={(e) => onChange({ ...data, sensorModel: e.target.value as SensorModel })}
        >
          <MenuItem value="HF_plus">HF+</MenuItem>
          <MenuItem value="TcAg">TcAg</MenuItem>
          <MenuItem value="TcAs">TcAs</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
}
