import type { MonitoringPointListItem, SensorModel } from "@dyn/contracts";
import { sensorModelSchema } from "@dyn/contracts";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { type FormEvent, useEffect, useState } from "react";

interface SensorDialogProps {
  point: MonitoringPointListItem | null;
  pending: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (input: { sensorId: string; model: SensorModel }) => void;
}

export function SensorDialog({ point, pending, error, onClose, onSubmit }: SensorDialogProps) {
  const [sensorId, setSensorId] = useState("");
  const [model, setModel] = useState<SensorModel>("HF+");
  const availableModels =
    point?.machineType === "Pump" ? (["HF+"] as const) : sensorModelSchema.options;

  useEffect(() => {
    if (point) {
      setSensorId("");
      setModel(point.machineType === "Pump" ? "HF+" : "TcAg");
    }
  }, [point]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({ sensorId: sensorId.trim(), model });
  }

  return (
    <Dialog fullWidth maxWidth="sm" onClose={onClose} open={Boolean(point)}>
      <DialogTitle>Associate sensor</DialogTitle>
      <DialogContent>
        <DialogContentText mb={2}>
          Associate a uniquely identified sensor with {point?.monitoringPointName}.
        </DialogContentText>
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : null}
        {point?.machineType === "Pump" ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            Pumps only support HF+ sensors. TcAg and TcAs are not compatible.
          </Alert>
        ) : null}
        <Stack component="form" id="sensor-form" onSubmit={handleSubmit} spacing={2}>
          <TextField
            autoFocus
            disabled={pending}
            inputProps={{ maxLength: 120 }}
            label="Sensor ID"
            onChange={(event) => setSensorId(event.target.value)}
            required
            value={sensorId}
          />
          <FormControl fullWidth size="small">
            <InputLabel id="sensor-model-label">Sensor model</InputLabel>
            <Select
              label="Sensor model"
              labelId="sensor-model-label"
              onChange={(event) => setModel(event.target.value as SensorModel)}
              value={model}
            >
              {availableModels.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button disabled={pending} onClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={pending || !sensorId.trim()}
          form="sensor-form"
          type="submit"
          variant="contained"
        >
          {pending ? <CircularProgress color="inherit" size={20} /> : "Associate"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
