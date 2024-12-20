"use client";

import React from "react";
// import { useDispatch } from "react-redux";
// import { addMachine, updateMachine } from "../redux/machinesSlice";
import {
  Box,
  Card,
  CardHeader,
  Divider,
  TextField,
  MenuItem,
  Button,
  Typography,
} from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";

// Validation schema
const machineSchema = z.object({
  name: z.string().min(1, "Machine name is required"),
  type: z.enum(["Pump", "Fan"], { required_error: "Type is required" }),
});

type MachineFormValues = z.infer<typeof machineSchema>;

interface MachineFormProps {
  existingMachine?: {
    id: string;
    name: string;
    type: "Pump" | "Fan";
  } | null;
}

const MachineForm: React.FC<MachineFormProps> = ({
  existingMachine = null,
}) => {
  // const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<MachineFormValues>({
    defaultValues: {
      name: existingMachine?.name || "",
      type: existingMachine?.type || "Pump",
    },
    resolver: zodResolver(machineSchema),
  });

  const onSubmit = (data: MachineFormValues) => {
    const machine = {
      id: existingMachine ? existingMachine.id : Date.now().toString(),
      name: data.name,
      type: data.type,
    };

    // if (existingMachine) {
    //   dispatch(updateMachine(machine));
    // } else {
    //   dispatch(addMachine(machine));
    // }
  };

  return (
    <Box>
      <Typography variant="body1">
        Add new machine
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
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
        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{ width: "100%", mt: "1rem" }}
        >
          {existingMachine ? "Update Machine" : "Add Machine"}
        </Button>
      </Box>
    </Box>
  );
};

export default MachineForm;
