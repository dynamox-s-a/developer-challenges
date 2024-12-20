"use client";
import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  CircularProgress,
} from "@mui/material";
import { z } from "zod";
import { useAppSelector } from "@/types/hooks";
import { useDispatch } from "react-redux";
import { addMonitoringPointToMachine } from "@/redux/machinesSlice";

// Validation schema for the form
const monitoringPointSchema = z.object({
  machineId: z.string().min(1, "Machine selection is required"),
  name: z.string().min(1, "Monitoring point name is required"),
  sensorModel: z.enum(["TcAg", "TcAs", "HF+"], {
    required_error: "Sensor model is required",
  }),
});

type MonitoringPointFormValues = z.infer<typeof monitoringPointSchema>;

const MonitoringPointForm: React.FC = () => {
  const dispatch = useDispatch();
  const machines = useAppSelector((state) => state.machines.machines);
  const isLoading = useAppSelector((state) => state.machines.isLoading); 

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<MonitoringPointFormValues>({
    defaultValues: {
      machineId: "",
      name: "",
      sensorModel: "HF+",
    },
    resolver: zodResolver(monitoringPointSchema),
    mode: "onChange",
  });

  const selectedMachineId = watch("machineId");
  const selectedMachine = machines.find(
    (machine) => machine.id === selectedMachineId,
  );

  const sensorOptions = getSensorOptions(selectedMachine);

  /**
   * Fetches the sensor options based on the machine type.
   * @param selectedMachine - The selected machine to determine the available sensor models
   * @returns An array of available sensor models
   */
  function getSensorOptions(selectedMachine?: { type: string }) {
    if (!selectedMachine) return [];
    return selectedMachine.type === "Fan"
      ? [
          { value: "TcAg", label: "TcAg" },
          { value: "TcAs", label: "TcAs" },
          { value: "HF+", label: "HF+" },
        ]
      : [{ value: "HF+", label: "HF+" }];
  }

  /**
   * Handles form submission, dispatches action to add monitoring point to a machine
   * @param data - The form data
   */
  const onSubmit = (data: MonitoringPointFormValues) => {
    const monitoringPoint = {
      id: Date.now().toString(),
      name: data.name,
      sensor: {
        id: Date.now().toString(),
        model: data.sensorModel,
      },
    };

    dispatch(
      addMonitoringPointToMachine({
        machineId: data.machineId,
        monitoringPoint,
      }),
    );

    reset();
  };

  return (
    <Box sx={{ minWidth: "300px" }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Controller
            name="machineId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.machineId}>
                <InputLabel>Select Machine</InputLabel>
                <Select {...field} label="Select Machine">
                  {isLoading ? (
                    <MenuItem disabled>
                      <CircularProgress size={24} />
                    </MenuItem>
                  ) : (
                    machines.map((machine) => (
                      <MenuItem key={machine.id} value={machine.id}>
                        {machine.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
                {errors.machineId && (
                  <FormHelperText>{errors.machineId?.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />

          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Monitoring Point Name"
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />

          <Controller
            name="sensorModel"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.sensorModel}>
                <InputLabel>Sensor Model</InputLabel>
                <Select {...field} label="Sensor Model">
                  {sensorOptions.map((sensor) => (
                    <MenuItem key={sensor.value} value={sensor.value}>
                      {sensor.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.sensorModel && (
                  <FormHelperText>{errors.sensorModel?.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />

          <Stack direction="row" spacing={2}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={!isValid}
            >
              Add Monitoring Point
            </Button>
          </Stack>
        </Stack>
      </form>
    </Box>
  );
};

export default MonitoringPointForm;
