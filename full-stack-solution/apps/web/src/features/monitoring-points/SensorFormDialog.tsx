import { useEffect, useMemo } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  SENSOR_MODELS,
  assignSensorSchema,
  getAllowedSensorModels,
  isSensorModelAllowed,
  sensorNotAllowedMessage,
  type AssignSensorInput,
  type MachineType,
  type MonitoringPoint,
} from "@full-stack-solution/shared";
import type { SerializedApiError } from "@web/api/api-error";
import { ErrorAlert } from "@web/components/common/ErrorAlert";
import { FormSelectField } from "@web/components/common/FormSelectField";
import { FormTextField } from "@web/components/common/FormTextField";

export interface SensorFormDialogProps {
  open: boolean;
  /** Point receiving the sensor; its machine type drives the allowed models. */
  monitoringPoint: MonitoringPoint | null;
  busy?: boolean;
  error?: SerializedApiError | null;
  onSubmit: (values: AssignSensorInput) => void;
  onClose: () => void;
}

/**
 * Builds a schema that also rejects sensor models the machine type forbids.
 *
 * The rule itself lives in `libs/shared` (`isSensorModelAllowed`) and is
 * enforced by the API too; checking it here turns a 422 round-trip into
 * immediate feedback without duplicating the rule.
 */
function buildSchema(machineType: MachineType) {
  return assignSensorSchema.superRefine((value, ctx) => {
    if (!isSensorModelAllowed(machineType, value.model)) {
      ctx.addIssue({
        code: "custom",
        path: ["model"],
        message: sensorNotAllowedMessage(machineType, value.model),
      });
    }
  });
}

type SensorFormValues = z.infer<typeof assignSensorSchema>;

/** Assigns (or replaces) the sensor of a monitoring point. */
export function SensorFormDialog({
  open,
  monitoringPoint,
  busy = false,
  error = null,
  onSubmit,
  onClose,
}: SensorFormDialogProps) {
  const machineType = monitoringPoint?.machineType ?? "Fan";

  const options = useMemo(() => {
    const allowed = getAllowedSensorModels(machineType);

    return SENSOR_MODELS.map((model) => ({
      value: model,
      label: model,
      disabled: !allowed.includes(model),
      description: allowed.includes(model)
        ? undefined
        : `not allowed on ${machineType}`,
    }));
  }, [machineType]);

  const { control, handleSubmit, reset } = useForm<SensorFormValues>({
    defaultValues: { id: "", model: getAllowedSensorModels(machineType)[0] },
    resolver: zodResolver(buildSchema(machineType)),
  });

  useEffect(() => {
    if (open && monitoringPoint) {
      reset({
        id: monitoringPoint.sensorId ?? "",
        model:
          monitoringPoint.sensorModel ??
          getAllowedSensorModels(monitoringPoint.machineType)[0],
      });
    }
  }, [monitoringPoint, open, reset]);

  const replacing = Boolean(monitoringPoint?.sensorId);

  return (
    <Dialog open={open} onClose={busy ? undefined : onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogTitle>
          {replacing ? "Replace sensor" : "Assign sensor"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {monitoringPoint ? (
              <Alert severity="info">
                {monitoringPoint.name} · {monitoringPoint.machineName} (
                {monitoringPoint.machineType})
              </Alert>
            ) : null}
            <ErrorAlert error={error} />
            <FormTextField
              control={control}
              name="id"
              label="Sensor ID"
              helperText="Typed by hand and unique across the whole system."
            />
            <FormSelectField
              control={control}
              name="model"
              label="Sensor model"
              options={options}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={busy}>
            {replacing ? "Replace sensor" : "Assign sensor"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
