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
  FormHelperText,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface EditMachineModalProps {
  open: boolean;
  machine: { id: string; name: string; type: "Pump" | "Fan" } | null;
  onClose: () => void;
  onSave: (id: string, name: string, type: "Pump" | "Fan") => void;
}

// Zod validation schema
const machineSchema = z.object({
  name: z.string().min(1, "Machine name is required"),
  type: z.enum(["Pump", "Fan"], {
    errorMap: () => ({ message: "Select a valid machine type" }),
  }),
});

type MachineFormValues = z.infer<typeof machineSchema>;

const EditMachineModal: React.FC<EditMachineModalProps> = ({
  open,
  machine,
  onClose,
  onSave,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<MachineFormValues>({
    defaultValues: {
      name: machine?.name || "",
      type: machine?.type || "Pump",
    },
    resolver: zodResolver(machineSchema),
  });

  const onSubmit = (data: MachineFormValues) => {
    if (machine) {
      onSave(machine.id, data.name, data.type);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Machine</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Machine Name"
                  fullWidth
                  margin="normal"
                  placeholder="Machine Name"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  sx={{ minWidth: "20rem" }}
                />
              )}
            />
          </div>
          <div>
            <FormControl fullWidth margin="normal" error={!!errors.type}>
              <InputLabel>Machine Type</InputLabel>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="Machine Type">
                    <MenuItem value="Pump">Pump</MenuItem>
                    <MenuItem value="Fan">Fan</MenuItem>
                  </Select>
                )}
              />
              {errors.type && (
                <FormHelperText>{errors.type.message}</FormHelperText>
              )}
            </FormControl>
          </div>
          <DialogActions>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="contained" type="submit">
              Save
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMachineModal;
