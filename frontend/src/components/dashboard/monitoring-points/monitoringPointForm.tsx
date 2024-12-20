"use client";
import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { z } from "zod";
import { useAppSelector } from "@/types/hooks";
import { useDispatch } from "react-redux";
import { addMonitoringPoint } from "@/redux/monitoringPointSlice";
// Validation schema
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

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<MonitoringPointFormValues>({
    defaultValues: {
      machineId: "",
      name: "",
      sensorModel: "HF+",
    },
    resolver: zodResolver(monitoringPointSchema),
  });

  const selectedMachineId = watch("machineId");

  const selectedMachine = machines.find(
    (machine) => machine.id === selectedMachineId,
  );
  const sensorOptions =
    selectedMachine?.type === "Fan"
      ? [
          { value: "TcAg", label: "TcAg" },
          { value: "TcAs", label: "TcAs" },
          { value: "HF+", label: "HF+" },
        ]
      : [{ value: "HF+", label: "HF+" }];

  const onSubmit = (data: MonitoringPointFormValues) => {
    console.log("data is", data);
    const monitoringPoint = {
      id: Date.now().toString(),
      name: data.name,
      sensor: {
        id: Date.now().toString(),
        model: data.sensorModel,
      },
    };

    dispatch(addMonitoringPoint(monitoringPoint));
    console.log("machines after add", machines);
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
                  {machines.map((machine) => (
                    <MenuItem key={machine.id} value={machine.id}>
                      {machine.name}
                    </MenuItem>
                  ))}
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

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            Add Monitoring Point
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default MonitoringPointForm;
