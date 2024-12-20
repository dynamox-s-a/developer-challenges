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
}

const UpdateMachineDialog: React.FC<UpdateMachineDialogProps> = ({
  open,
  onClose,
  machine,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogContent>
        <MachineForm existingMachine={machine} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default UpdateMachineDialog;
