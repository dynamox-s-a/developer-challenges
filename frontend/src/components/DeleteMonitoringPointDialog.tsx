import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

type DeleteMonitoringPointDialogProps = {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  pointName: string | undefined;
};

const DeleteMonitoringPointDialog: React.FC<DeleteMonitoringPointDialogProps> = ({
  open,
  onClose,
  onDelete,
  pointName,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Deletar</DialogTitle>
      <DialogContent>
        <Typography>
          Você tem certeza que deseja deletar o ponto de monitoramento "{pointName}"? Esta ação não pode ser desfeita.
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

export default DeleteMonitoringPointDialog;