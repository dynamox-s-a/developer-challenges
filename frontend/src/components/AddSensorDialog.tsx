import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
} from "@mui/material";
import { SensorModel, Machine, MachineType } from "../services/api";

type AddSensorDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  currentPointName: string | undefined;
  currentMachineType: MachineType | undefined;
  sensorFormData: { model: SensorModel };
  onSensorModelChange: (e: React.ChangeEvent<{ name?: string; value: unknown }>) => void;
};

const AddSensorDialog: React.FC<AddSensorDialogProps> = ({
  open,
  onClose,
  onSubmit,
  currentPointName,
  currentMachineType,
  sensorFormData,
  onSensorModelChange,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Adicionar sensor à {currentPointName}</DialogTitle>
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
              onChange={onSensorModelChange}
            >
              <MenuItem value={SensorModel.HFPlus}>HF+</MenuItem>
              <MenuItem
                value={SensorModel.TcAg}
                disabled={currentMachineType === MachineType.Pump}
              >
                TcAg {currentMachineType === MachineType.Pump && "(Não compatível com Pump)"}
              </MenuItem>
              <MenuItem
                value={SensorModel.TcAs}
                disabled={currentMachineType === MachineType.Pump}
              >
                TcAs {currentMachineType === MachineType.Pump && "(Não compatível com Pump)"}
              </MenuItem>
            </Select>
          </FormControl>

          {currentMachineType === MachineType.Pump && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              Atenção: TcAg e TcAs não podem ser utilizados com máquinas do tipo Pump
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onSubmit} variant="contained">
          Adicionar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSensorDialog;