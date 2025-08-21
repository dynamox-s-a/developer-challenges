import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from "@mui/material";

interface DeleteMachineDialogProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  machineName: string | null;
}

const DeleteMachineDialog: React.FC<DeleteMachineDialogProps> = ({
  open,
  onClose,
  onDelete,
  machineName,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Deletar Máquina</DialogTitle>
      <DialogContent>
        <Typography>
          Você tem certeza que deseja deletar a máquina "{machineName}"?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onDelete} color="error" variant="contained">
          Deletar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteMachineDialog;