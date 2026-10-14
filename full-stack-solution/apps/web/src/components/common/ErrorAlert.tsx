import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Button from "@mui/material/Button";
import type { SerializedApiError } from "@web/api/api-error";

export interface ErrorAlertProps {
  error: SerializedApiError | null;
  onDismiss?: () => void;
  onRetry?: () => void;
}

/**
 * Renders an API failure, including the field-level `details` the API sends
 * for validation errors. Returns `null` when there is no error, so callers can
 * render it unconditionally.
 */
export function ErrorAlert({ error, onDismiss, onRetry }: ErrorAlertProps) {
  if (!error) {
    return null;
  }

  return (
    <Alert
      severity="error"
      onClose={onDismiss}
      action={
        onRetry ? (
          <Button color="inherit" size="small" onClick={onRetry}>
            Retry
          </Button>
        ) : undefined
      }
    >
      <AlertTitle sx={{ mb: error.details?.length ? undefined : 0 }}>
        {error.message}
      </AlertTitle>
      {error.details?.length ? (
        <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
          {error.details.map((detail) => (
            <li key={`${detail.path}-${detail.message}`}>
              {detail.path ? `${detail.path}: ` : ""}
              {detail.message}
            </li>
          ))}
        </ul>
      ) : null}
    </Alert>
  );
}
