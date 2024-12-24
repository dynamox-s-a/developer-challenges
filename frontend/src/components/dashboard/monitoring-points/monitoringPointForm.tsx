"use client";
import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  CircularProgress,
  Card,
  Snackbar,
  Alert,
} from "@mui/material";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "@/types/hooks";
import { addMonitoringPointThunk, fetchSensors } from "@/redux/machines/thunks";
import { NOTIFICATION_DURATION, NOTIFICATION_MESSAGES } from "@/constants/machines";
import { useNotification } from "@/hooks/use-notifications";

// Validation schema for the form
const monitoringPointSchema = z.object({
  machineId: z.string().min(1, "Machine selection is required"),
  name: z.string().min(1, "Monitoring point name is required"),
  sensorId: z.string().min(1, "Sensor model is required"),
});

type MonitoringPointFormValues = z.infer<typeof monitoringPointSchema>;

/**
 * Component for adding a new monitoring point to a machine.
 * @returns {JSX.Element} The rendered form for adding a monitoring point.
 */
const MonitoringPointForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { machines, isLoading, sensors } = useAppSelector(
    (state) => state.machines,
  );
  const { notification, showNotification, hideNotification } =
    useNotification();

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
      sensorId: undefined,
    },
    resolver: zodResolver(monitoringPointSchema),
    mode: "onChange",
  });

  const selectedMachineId = watch("machineId");
  const selectedMachine = machines.find(
    (machine) => machine.id === selectedMachineId,
  );

  // Filter sensors based on the selected machine type
  const filteredSensors = React.useMemo(() => {
    if (selectedMachine?.type === "Pump") {
      return sensors.filter((sensor) => sensor.name === "HF+");
    }
    return sensors;
  }, [selectedMachine, sensors]);

  // Fetch sensors on component mount
  React.useEffect(() => {
    dispatch(fetchSensors());
  }, [dispatch]);

  /**
   * Handles form submission by dispatching the action to add the monitoring point
   * to the selected machine.
   * @param {MonitoringPointFormValues} data - The form data to be submitted.
   */
  const onSubmit = async (data: MonitoringPointFormValues) => {
    try {
      const selectedSensor = sensors.find(
        (sensor) => sensor.id === data.sensorId,
      );

      if (!selectedSensor) {
        console.error("Sensor not found");
        return;
      }

      const monitoringPoint = {
        name: data.name,
        sensorId: selectedSensor.id,
        sensorModel: selectedSensor.name,
      };

      await dispatch(
        addMonitoringPointThunk({
          machineId: data.machineId,
          monitoringPoint,
        }),
      );
      showNotification(NOTIFICATION_MESSAGES.CREATE_MP_SUCCESS, "success");
      reset();
    } catch (error) {
      showNotification(NOTIFICATION_MESSAGES.OPERATION_ERROR, "error");
    }
  };

  return (
    <>
      <Card variant="outlined" sx={{ p: 2 }}>
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
              name="sensorId"
              control={control}
              render={({ field: { onChange, value } }) => (
                <FormControl fullWidth error={!!errors.sensorId}>
                  <InputLabel>Sensor</InputLabel>
                  <Select
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    label="Sensor"
                  >
                    {filteredSensors.map((sensor) => (
                      <MenuItem key={sensor.id} value={sensor.id}>
                        {sensor.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.sensorId && (
                    <FormHelperText>{errors.sensorId?.message}</FormHelperText>
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
      </Card>
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
    </>
  );
};

export default MonitoringPointForm;
