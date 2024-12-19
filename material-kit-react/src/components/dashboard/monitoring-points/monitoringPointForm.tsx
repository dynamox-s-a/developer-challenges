"use client";
import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { useDispatch, useSelector } from "react-redux";
// import { addMonitoringPoint } from "../redux/machinesSlice";
// import { RootState } from "@/store/store";
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
  Typography,
} from "@mui/material";
import { z } from "zod";

const mockMachines = [
  {
    id: "1",
    name: "Pump 1",
    type: "Pump",
    monitoringPoints: [
      { id: "mp1", name: "Point A", sensor: { id: "s1", model: "TcAg" } },
      { id: "mp2", name: "Point B", sensor: { id: "s2", model: "TcAs" } },
    ],
  },
  {
    id: "2",
    name: "Fan 1",
    type: "Fan",
    monitoringPoints: [
      { id: "mp3", name: "Point C", sensor: { id: "s3", model: "HF+" } },
    ],
  },
  {
    id: "2",
    name: "Fan 1",
    type: "Fan",
    monitoringPoints: [
      { id: "mp3", name: "Point C", sensor: { id: "s3", model: "HF+" } },
    ],
  },
  {
    id: "2",
    name: "Fan 1",
    type: "Fan",
    monitoringPoints: [
      { id: "mp3", name: "Point C", sensor: { id: "s3", model: "HF+" } },
    ],
  },
  {
    id: "2",
    name: "Fan 1",
    type: "Fan",
    monitoringPoints: [
      { id: "mp3", name: "Point C", sensor: { id: "s3", model: "HF+" } },
    ],
  },
];

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
  // const dispatch = useDispatch();
  // const machines = useSelector((state: RootState) => state.machines.machines);

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
  const selectedMachine = mockMachines.find(
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
    const monitoringPoint = {
      id: Date.now().toString(),
      machineId: data.machineId,
      name: data.name,
      sensor: {
        id: Date.now().toString(),
        model: data.sensorModel,
      },
    };

    // dispatch(
    //   addMonitoringPoint({
    //     machineId: data.machineId,
    //     monitoringPoint,
    //   }),
    // );
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "0 auto", padding: 3 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Controller
            name="machineId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.machineId}>
                <InputLabel>Select Machine</InputLabel>
                <Select {...field} label="Select Machine">
                  {mockMachines.map((machine) => (
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
