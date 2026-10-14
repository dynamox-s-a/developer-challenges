import { useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  MACHINE_TYPES,
  createMachineSchema,
  getBlockedSensorModels,
  type CreateMachineInput,
  type Machine,
} from "@full-stack-solution/shared";
import { ErrorAlert } from "@web/components/common/ErrorAlert";
import { FormSelectField } from "@web/components/common/FormSelectField";
import { FormTextField } from "@web/components/common/FormTextField";
import type { SerializedApiError } from "@web/api/api-error";

export interface MachineFormDialogProps {
  open: boolean;
  /** `null` creates a machine; a machine edits it. */
  machine: Machine | null;
  busy?: boolean;
  error?: SerializedApiError | null;
  onSubmit: (values: CreateMachineInput) => void;
  onClose: () => void;
}

const typeOptions = MACHINE_TYPES.map((type) => {
  const blocked = getBlockedSensorModels(type);

  return {
    value: type,
    label: type,
    description: blocked.length
      ? `${blocked.join(" and ")} sensors not allowed`
      : undefined,
  };
});

/**
 * Create/edit form for a machine, reusing `createMachineSchema` from
 * `libs/shared` for validation.
 *
 * The machine type lists which sensor models it rejects, making the Pump rule
 * visible before the user hits a 422 from the API.
 */
export function MachineFormDialog({
  open,
  machine,
  busy = false,
  error = null,
  onSubmit,
  onClose,
}: MachineFormDialogProps) {
  const { control, handleSubmit, reset } = useForm<CreateMachineInput>({
    defaultValues: { name: "", type: "Pump" },
    resolver: zodResolver(createMachineSchema),
  });

  // The dialog stays mounted between openings, so the form has to be refilled
  // every time the target machine changes.
  useEffect(() => {
    if (open) {
      reset(
        machine
          ? { name: machine.name, type: machine.type }
          : { name: "", type: "Pump" },
      );
    }
  }, [machine, open, reset]);

  return (
    <Dialog open={open} onClose={busy ? undefined : onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogTitle>{machine ? "Edit machine" : "New machine"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <ErrorAlert error={error} />
            <FormTextField
              control={control}
              name="name"
              label="Name"
            />
            <FormSelectField
              control={control}
              name="type"
              label="Type"
              options={typeOptions}
              helperText={
                machine
                  ? "Switching to Pump fails while TcAg/TcAs sensors are installed."
                  : undefined
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={busy}>
            {machine ? "Save changes" : "Create machine"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
