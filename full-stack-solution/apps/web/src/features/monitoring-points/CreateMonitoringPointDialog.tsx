import { useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createMonitoringPointSchema } from "@full-stack-solution/shared";
import { useAppDispatch, useAppSelector } from "@web/app/hooks";
import { ErrorAlert } from "@web/components/common/ErrorAlert";
import { FormSelectField } from "@web/components/common/FormSelectField";
import { FormTextField } from "@web/components/common/FormTextField";
import { notify } from "@web/features/notifications/notifications.slice";
import {
  createMonitoringPoint,
  monitoringPointsErrorDismissed,
} from "./monitoring-points.slice";

const schema = createMonitoringPointSchema.extend({
  machineId: z.string().min(1, "Select a machine"),
});

type Values = z.infer<typeof schema>;

export interface CreateMonitoringPointDialogProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Creates a monitoring point from the monitoring points page, where the
 * machine is not implied by the context and has to be chosen.
 */
export function CreateMonitoringPointDialog({
  open,
  onClose,
}: CreateMonitoringPointDialogProps) {
  const dispatch = useAppDispatch();
  const machines = useAppSelector((state) => state.machines.items);
  const { isMutating, error } = useAppSelector(
    (state) => state.monitoringPoints,
  );

  const { control, handleSubmit, reset } = useForm<Values>({
    defaultValues: { machineId: "", name: "" },
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (open) {
      reset({ machineId: machines[0]?.id ?? "", name: "" });
    }
  }, [machines, open, reset]);

  const onSubmit = async ({ machineId, name }: Values) => {
    const result = await dispatch(
      createMonitoringPoint({ machineId, input: { name } }),
    );

    if (result.meta.requestStatus === "fulfilled") {
      dispatch(notify("Monitoring point created"));
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={isMutating ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogTitle>New monitoring point</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <ErrorAlert error={error} />
            <FormSelectField
              control={control}
              name="machineId"
              label="Machine"
              options={machines.map((machine) => ({
                value: machine.id,
                label: machine.name,
                description: machine.type,
              }))}
            />
            <FormTextField
              control={control}
              name="name"
              label="Monitoring point name"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              dispatch(monitoringPointsErrorDismissed());
              onClose();
            }}
            disabled={isMutating}
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isMutating}>
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
