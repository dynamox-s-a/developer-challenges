import type { Machine } from "@dyn/contracts";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { type FormEvent, useEffect, useState } from "react";

interface MonitoringPointDialogProps {
  machine: Machine | null;
  pending: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

export function MonitoringPointDialog({
  machine,
  pending,
  error,
  onClose,
  onSubmit,
}: MonitoringPointDialogProps) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (machine) {
      setName("");
    }
  }, [machine]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(name.trim());
  }

  return (
    <Dialog fullWidth maxWidth="sm" onClose={onClose} open={Boolean(machine)}>
      <DialogTitle>Add monitoring point</DialogTitle>
      <DialogContent>
        <DialogContentText mb={2}>
          Add a point to {machine?.name}. You can associate its sensor from the monitoring page.
        </DialogContentText>
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : null}
        <Stack component="form" id="point-form" onSubmit={handleSubmit}>
          <TextField
            autoFocus
            disabled={pending}
            inputProps={{ maxLength: 120 }}
            label="Monitoring point name"
            onChange={(event) => setName(event.target.value)}
            required
            value={name}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button disabled={pending} onClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={pending || !name.trim()}
          form="point-form"
          type="submit"
          variant="contained"
        >
          {pending ? <CircularProgress color="inherit" size={20} /> : "Add point"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
