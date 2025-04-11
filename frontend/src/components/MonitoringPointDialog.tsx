import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";

interface MonitoringPointDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  formData: { name: string; machineId: number };
  machines: { id: number; name: string; type: string }[];
  onFormChange: (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => void;
  onMachineChange: (e: React.ChangeEvent<{ name?: string; value: unknown }>) => void;
}

const MonitoringPointDialog: React.FC<MonitoringPointDialogProps> = ({
  open,
  onClose,
  onSubmit,
  formData,
  machines,
  onFormChange,
  onMachineChange,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {formData.name ? "Edit Monitoring Point" : "Add New Monitoring Point"}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          name="name"
          label="Nome do Ponto"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.name}
          onChange={onFormChange}
          required
        />
        <FormControl fullWidth margin="dense">
          <InputLabel id="machine-label">Máquina</InputLabel>
          <Select
            labelId="machine-label"
            id="machineId"
            name="machineId"
            value={formData.machineId || ""}
            label="Machine"
            onChange={onMachineChange}
          >
            {machines.map((machine) => (
              <MenuItem key={machine.id} value={machine.id}>
                {machine.name} ({machine.type})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          disabled={!formData.name || !formData.machineId}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MonitoringPointDialog;