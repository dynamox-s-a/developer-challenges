"use client";

import React from "react";
import { Box, Button, TextField, MenuItem, Typography } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { Machine } from "@/types/machines";
import { useAppDispatch } from "@/types/hooks";
import {
  createMachineThunk,
  updateMachineThunk,
} from "@/redux/machines/thunks";

// Validation schema for the machine form
const machineSchema = z.object({
  name: z.string().min(1, "Machine name is required"),
  type: z.enum(["Pump", "Fan"], { required_error: "Type is required" }),
});

type MachineFormValues = z.infer<typeof machineSchema>;

/**
 * Props for the MachineForm component
 * @interface MachineFormProps
 * @property {Machine | null} [existingMachine] - An optional machine object to edit, if available.
 * @property {() => void} [onClose] - Optional callback function to close the form dialog.
 */
interface MachineFormProps {
  existingMachine?: Machine | null;
  onClose?: () => void;
}

const MachineForm: React.FC<MachineFormProps> = ({
  existingMachine = null,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<MachineFormValues>({
    defaultValues: {
      name: existingMachine?.name || "",
      type: existingMachine?.type || "Pump",
    },
    resolver: zodResolver(machineSchema),
  });

  /**
   * Handle the form submission.
   * Dispatches an action to either update or add a machine to the store.
   * @param {MachineFormValues} data - The form data submitted by the user.
   */
  // Handle form submission (either create or update machine)
  const onSubmit = (data: MachineFormValues) => {
    console.log("data", data);
    console.log("existingMachine", existingMachine);
    if (existingMachine) {
      const updateMachine = {
        id: existingMachine.id,
        name: data.name,
        type: data.type,
      };
      dispatch(updateMachineThunk(updateMachine));
    } else {
      dispatch(createMachineThunk(data));
    }

    reset();
    if (onClose) onClose();
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Typography
        variant="h6"
        mb={2}
        display={existingMachine ? "block" : "none"}
      >
        Update machine
      </Typography>

      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Machine Name"
            fullWidth
            error={!!errors.name}
            helperText={errors.name?.message}
            margin="normal"
          />
        )}
      />

      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Machine Type"
            select
            fullWidth
            error={!!errors.type}
            helperText={errors.type?.message}
            margin="normal"
          >
            <MenuItem value="Pump">Pump</MenuItem>
            <MenuItem value="Fan">Fan</MenuItem>
          </TextField>
        )}
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
        {existingMachine && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={onClose}
            sx={{ flex: 1 }}
          >
            Cancel
          </Button>
        )}
        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{ flex: 1 }}
          disabled={!isValid}
        >
          {existingMachine ? "Update" : "Add"}
        </Button>
      </Box>
    </Box>
  );
};

export default MachineForm;
