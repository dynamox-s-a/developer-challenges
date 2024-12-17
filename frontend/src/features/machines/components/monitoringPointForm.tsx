import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { addMonitoringPoint } from "../redux/machinesSlice";
import { RootState } from "@/store/store";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Card,
  CardHeader,
  Divider,
} from "@mui/material";
import { z } from "zod";

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
  const machines = useSelector((state: RootState) => state.machines.machines);

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

  // Watch selected machine to determine sensor options
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
    const monitoringPoint = {
      id: Date.now().toString(),
      machineId: data.machineId,
      name: data.name,
      sensor: {
        id: Date.now().toString(),
        model: data.sensorModel,
      },
    };

    dispatch(
      addMonitoringPoint({
        machineId: data.machineId,
        monitoringPoint,
      }),
    );
  };

  return (
    <Card variant="outlined" sx={{ flex: 1 }}>
      <CardHeader
        title="Add New Monitoring Point"
        sx={{
          "& .MuiCardHeader-title": { fontWeight: 600, fontSize: "1.5rem" },
        }}
      />
      <Divider />
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 3 }}>
        {/* Select Machine */}
        <Controller
          name="machineId"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Select Machine"
              fullWidth
              error={!!errors.machineId}
              helperText={errors.machineId?.message}
              margin="normal"
            >
              {machines.map((machine) => (
                <MenuItem key={machine.id} value={machine.id}>
                  {machine.name}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        {/* Monitoring Point Name */}
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
              margin="normal"
            />
          )}
        />

        {/* Sensor Model */}
        <Controller
          name="sensorModel"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Sensor Model"
              fullWidth
              error={!!errors.sensorModel}
              helperText={errors.sensorModel?.message}
              margin="normal"
            >
              {sensorOptions.map((sensor) => (
                <MenuItem key={sensor.value} value={sensor.value}>
                  {sensor.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        {/* Submit Button */}
        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{ width: "100%", mt: "1rem" }}
        >
          Add Monitoring Point
        </Button>
      </Box>
    </Card>
  );
};

export default MonitoringPointForm;
