import React from "react";
import {
  Dialog,
  DialogContent,
} from "@mui/material";
import { Machine } from "@/types/machines";
import MachineForm from "./machineForm";

/**
 * Props for the UpdateMachineDialog component.
 * @property {boolean} open - Whether the dialog is open or closed.
 * @property {function} onClose - Function to handle closing the dialog.
 * @property {Machine | null} machine - The machine data to pre-fill in the form, or null if no machine is selected.
 * @property {function} [onSuccess] - Optional callback to be called if the form submission is successful.
 * @property {function} [onError] - Optional callback to be called if the form submission fails.
 */

interface UpdateMachineDialogProps {
  open: boolean;
  onClose: () => void;
  machine: Machine | null;
  onSuccess?: () => void; 
  onError?: () => void;
}

/**
 * A dialog component for updating an existing machine.
 * @param {UpdateMachineDialogProps} props - The props for the dialog.
 * @returns {JSX.Element} The rendered UpdateMachineDialog component.
 */
const UpdateMachineDialog: React.FC<UpdateMachineDialogProps> = ({
  open,
  onClose,
  machine,
  onSuccess,
  onError,
}) => {
  /**
   * Handles the form submission and triggers the appropriate callback.
   * @param {boolean} success - Indicates whether the form submission was successful.
   */
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