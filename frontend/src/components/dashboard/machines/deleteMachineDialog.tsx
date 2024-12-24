import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  DialogTitle,
  Typography,
} from "@mui/material";
import { Machine } from "@/types/machines";

interface DeleteMachineDialogProps {
  open: boolean;
  onClose: () => void;
  machine: Machine | null;
  onDelete: () => void;
}

/**
 * DeleteMachineDialog is a modal dialog that asks the user to confirm the deletion of a machine.
 */
const DeleteMachineDialog: React.FC<DeleteMachineDialogProps> = ({
  open,
  onClose,
  machine,
  onDelete,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-dialog-title"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete this machine?</Typography>
        <Typography variant="body2" color="textSecondary">
          {machine?.name}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={onDelete} color="primary" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteMachineDialog;