"use client";

import React from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Snackbar,
  Alert,
  Card,
} from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { Machine } from "@/types/machines";
import { useAppDispatch } from "@/types/hooks";
import {
  createMachineThunk,
  updateMachineThunk,
} from "@/redux/machines/thunks";
import { useNotification } from "@/hooks/use-notifications";
import {
  NOTIFICATION_DURATION,
  NOTIFICATION_MESSAGES,
} from "@/constants/machines";

// Validation schema for the machine form
const machineSchema = z.object({
  name: z.string().min(1, "Machine name is required"),
  type: z.enum(["Pump", "Fan"], { required_error: "Type is required" }),
});

type MachineFormValues = z.infer<typeof machineSchema>;

/**
 * Props for the MachineForm component
 * @property {Machine | null} [existingMachine] - An optional machine object to edit, if available.
 * @property {() => void} [onClose] - Optional callback function to close the form dialog.
 * @property {(success: boolean) => void} [onSubmitComplete] - Optional callback for handling submission completion.
 */
interface MachineFormProps {
  existingMachine?: Machine | null;
  onClose?: () => void;
  onSubmitComplete?: (success: boolean) => void;
}

const MachineForm: React.FC<MachineFormProps> = ({
  existingMachine = null,
  onClose,
  onSubmitComplete,
}) => {
  const dispatch = useAppDispatch();
  const { notification, showNotification, hideNotification } =
    useNotification();

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
   * Handles success and error cases through callbacks.
   * @param {MachineFormValues} data - The form data submitted by the user.
   */
  const onSubmit = async (data: MachineFormValues) => {
    try {
      if (existingMachine) {
        const updateMachine = {
          id: existingMachine.id,
          name: data.name,
          type: data.type,
        };
        await dispatch(updateMachineThunk(updateMachine)).unwrap();
      } else {
        await dispatch(createMachineThunk(data)).unwrap();
        showNotification(NOTIFICATION_MESSAGES.CREATE_SUCCESS, "success");
      }

      reset();
      onSubmitComplete?.(true);
      onClose?.();
    } catch (error) {
      onSubmitComplete?.(false);
      showNotification(NOTIFICATION_MESSAGES.UPDATE_SUCCESS, "success");
    }
  };

  return (
    <Card variant="outlined" sx={{ p: 2 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h6" mb={2}>
          {existingMachine ? "Update Machine" : "Create Machine"}
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

        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}
        >
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

        <Snackbar
          open={notification.open}
          autoHideDuration={NOTIFICATION_DURATION}
          onClose={hideNotification}
        >
          <Alert
            onClose={hideNotification}
            severity={notification.severity}
            sx={{ width: "100%" }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </form>
    </Card>
  );
};

export default MachineForm;
