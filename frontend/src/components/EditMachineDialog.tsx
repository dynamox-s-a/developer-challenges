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
  Box,
} from "@mui/material";
import { MachineType } from "../services/api";

interface EditMachineDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  formData: { name: string; type: MachineType };
  onFormChange: (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => void;
  onSelectChange: (e: { target: { name?: string; value: unknown } }) => void;
  isEditing: boolean;
}

const EditMachineDialog: React.FC<EditMachineDialogProps> = ({
  open,
  onClose,
  onSubmit,
  formData,
  onFormChange,
  onSelectChange,
  isEditing,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditing ? "Editar máquina" : "Adicionar máquina"}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="name"
            label="Nome"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={onFormChange}
            required
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="type-label">Tipo da máquina</InputLabel>
            <Select
              labelId="type-label"
              id="type"
              name="type"
              value={formData.type}
              label="Machine Type"
              onChange={onSelectChange}
            >
              <MenuItem value={MachineType.Pump}>Pump</MenuItem>
              <MenuItem value={MachineType.Fan}>Fan</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          disabled={!formData.name}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditMachineDialog;