import { useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  createMonitoringPointSchema,
  type CreateMonitoringPointInput,
} from "@full-stack-solution/shared";
import type { SerializedApiError } from "@web/api/api-error";
import { ErrorAlert } from "@web/components/common/ErrorAlert";
import { FormTextField } from "@web/components/common/FormTextField";

export interface MonitoringPointFormDialogProps {
  open: boolean;
  /** Machine the point belongs to, shown for context when creating. */
  machineName?: string;
  /** Current name when renaming; empty when creating. */
  initialName?: string;
  busy?: boolean;
  error?: SerializedApiError | null;
  onSubmit: (values: CreateMonitoringPointInput) => void;
  onClose: () => void;
}

/** Create/rename form for a monitoring point. */
export function MonitoringPointFormDialog({
  open,
  machineName,
  initialName = "",
  busy = false,
  error = null,
  onSubmit,
  onClose,
}: MonitoringPointFormDialogProps) {
  const { control, handleSubmit, reset } =
    useForm<CreateMonitoringPointInput>({
      defaultValues: { name: initialName },
      resolver: zodResolver(createMonitoringPointSchema),
    });

  useEffect(() => {
    if (open) {
      reset({ name: initialName });
    }
  }, [initialName, open, reset]);

  const isRename = initialName !== "";

  return (
    <Dialog open={open} onClose={busy ? undefined : onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogTitle>
          {isRename ? "Rename monitoring point" : "New monitoring point"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {machineName && !isRename ? (
              <DialogContentText>
                It will be created on <strong>{machineName}</strong>.
              </DialogContentText>
            ) : null}
            <ErrorAlert error={error} />
            <FormTextField
              control={control}
              name="name"
              label="Monitoring point name"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={busy}>
            {isRename ? "Save changes" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
