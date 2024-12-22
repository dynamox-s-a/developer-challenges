import React from "react";
import {
  Dialog,
  DialogContent,
} from "@mui/material";
import { Machine } from "@/types/machines";
import MachineForm from "./machineForm";

interface UpdateMachineDialogProps {
  open: boolean;
  onClose: () => void;
  machine: Machine | null;
  onSuccess?: () => void; 
  onError?: () => void;
}

const UpdateMachineDialog: React.FC<UpdateMachineDialogProps> = ({
  open,
  onClose,
  machine,
  onSuccess,
  onError,
}) => {
  const handleFormSubmit = async (success: boolean) => {
    if (success && onSuccess) {
      onSuccess();
    } else if (!success && onError) {
      onError();
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogContent>
        <MachineForm 
          existingMachine={machine} 
          onClose={onClose}
          onSubmitComplete={handleFormSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UpdateMachineDialog;