import { useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import {
  MAX_READINGS_PER_BATCH,
  MEASUREMENT_METRICS,
  createReadingsSchema,
  metricWithUnit,
  type CreateReadingsInput,
  type MeasurementMetric,
} from "@full-stack-solution/shared";
import type { SerializedApiError } from "@web/api/api-error";
import { ErrorAlert } from "@web/components/common/ErrorAlert";
import { generateSampleReadings } from "./sample-readings";

export interface IngestReadingsDialogProps {
  open: boolean;
  monitoringPointName?: string;
  busy?: boolean;
  error?: SerializedApiError | null;
  onSubmit: (input: CreateReadingsInput) => void;
  onClose: () => void;
}

const SAMPLE_SIZE = 60;
const PREFILLED_SAMPLE_SIZE = 3;

/**
 * Validates the editor content against the schema the API uses.
 *
 * Accepts both a bare array and the `{ readings: [...] }` envelope; returns the
 * parsed payload or a human-readable problem description.
 */
export function parseReadingsPayload(
  text: string,
): { ok: true; data: CreateReadingsInput } | { ok: false; message: string } {
  let parsed: unknown;

  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, message: "The payload is not valid JSON." };
  }

  const candidate = Array.isArray(parsed) ? { readings: parsed } : parsed;
  const result = createReadingsSchema.safeParse(candidate);

  if (!result.success) {
    return {
      ok: false,
      message: result.error.issues
        .slice(0, 5)
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("\n"),
    };
  }

  return { ok: true, data: result.data };
}

type FormProps = Omit<IngestReadingsDialogProps, "open">;

/**
 * Editor body.
 *
 * Mounted only while the dialog is open, so the sample payload is produced by
 * the state initializer instead of an effect that would reset it on every
 * render pass.
 */
function IngestReadingsForm({
  monitoringPointName,
  busy = false,
  error = null,
  onSubmit,
  onClose,
}: FormProps) {
  const [metric, setMetric] = useState<MeasurementMetric>("temperature");
  const [text, setText] = useState(() =>
    JSON.stringify(generateSampleReadings(PREFILLED_SAMPLE_SIZE), null, 2),
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = () => {
    const result = parseReadingsPayload(text);

    if (!result.ok) {
      setValidationError(result.message);
      return;
    }

    setValidationError(null);
    onSubmit(result.data);
  };

  return (
    <>
      <DialogTitle>Send readings</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {monitoringPointName ? (
            <Alert severity="info">
              Readings will be stored on <strong>{monitoringPointName}</strong>.
            </Alert>
          ) : null}

          <ErrorAlert error={error} />

          {validationError ? (
            <Alert severity="error" sx={{ whiteSpace: "pre-line" }}>
              {validationError}
            </Alert>
          ) : null}

          {/* Seeds the generator only — the editor content is what gets sent,
              and every reading carries its own metric. */}
          <TextField
            select
            label="Quantity for the generated sample"
            value={metric}
            onChange={(event) => {
              const next = event.target.value as MeasurementMetric;
              setMetric(next);
              setText(
                JSON.stringify(
                  generateSampleReadings(PREFILLED_SAMPLE_SIZE, next),
                  null,
                  2,
                ),
              );
            }}
            fullWidth
          >
            {MEASUREMENT_METRICS.map((option) => (
              <MenuItem key={option} value={option}>
                {metricWithUnit(option)}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Readings (JSON)"
            value={text}
            onChange={(event) => setText(event.target.value)}
            multiline
            minRows={10}
            fullWidth
            inputProps={{
              spellCheck: false,
              style: { fontFamily: "monospace" },
            }}
          />

          <Typography color="text.secondary" variant="caption">
            Up to {MAX_READINGS_PER_BATCH.toLocaleString()} readings per
            request. Each item is{" "}
            <code>
              {'{ "timestamp": ISO 8601 with offset, "value": number, "metric": ... }'}
            </code>
            . The metric names the physical quantity, which is what lets the
            chart label its axis; a batch may mix quantities. Duplicate
            timestamps of the same quantity are skipped by the server.
          </Typography>

          <div>
            <Button
              onClick={() =>
                setText(
                  JSON.stringify(
                    generateSampleReadings(SAMPLE_SIZE, metric),
                    null,
                    2,
                  ),
                )
              }
              disabled={busy}
            >
              Generate {SAMPLE_SIZE} sample readings
            </Button>
          </div>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={busy}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={busy}>
          Send
        </Button>
      </DialogActions>
    </>
  );
}

/**
 * Sends raw readings to a monitoring point.
 *
 * The payload is typed as JSON — the real producer is a sensor gateway, not a
 * person, so a free-form editor is closer to the actual contract than a
 * one-reading-at-a-time form. It is validated with `createReadingsSchema`
 * (the schema the API uses) before anything is sent, and a sample series can
 * be generated to try the flow out.
 */
export function IngestReadingsDialog({
  open,
  ...formProps
}: IngestReadingsDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={formProps.busy ? undefined : formProps.onClose}
      fullWidth
      maxWidth="md"
    >
      {open ? <IngestReadingsForm {...formProps} /> : null}
    </Dialog>
  );
}
