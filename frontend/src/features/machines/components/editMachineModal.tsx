import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";

interface EditMachineModalProps {
  open: boolean;
  machine: { id: string; name: string; type: "Pump" | "Fan" } | null;
  onClose: () => void;
  onSave: (id: string, name: string, type: "Pump" | "Fan") => void;
}

const EditMachineModal: React.FC<EditMachineModalProps> = ({
  open,
  machine,
  onClose,
  onSave,
}) => {
  const [name, setName] = React.useState(machine?.name || "");
  const [type, setType] = React.useState<"Pump" | "Fan">(
    machine?.type || "Pump",
  );

  const handleSubmit = () => {
    if (machine) {
      onSave(machine.id, name, type);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Machine</DialogTitle>
      <DialogContent>
        <div>
          <TextField
            label="Machine Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
            placeholder="Machine Name"
          />
        </div>
        <div>
          <FormControl fullWidth margin="normal">
            <InputLabel>Machine Type</InputLabel>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value as "Pump" | "Fan")}
              label="Machine Type"
            >
              <MenuItem value="Pump">Pump</MenuItem>
              <MenuItem value="Fan">Fan</MenuItem>
            </Select>
          </FormControl>
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" color="secondary" onClick={handleSubmit}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditMachineModal;
