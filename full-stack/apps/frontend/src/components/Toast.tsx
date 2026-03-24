import { Snackbar, Alert } from "@mui/material";

type ToastProps = {
  open: boolean;
  message: string;
  severity: "success" | "error" | "warning" | "info";
  onClose: () => void;
  autoHideDuration?: number;
};

export function Toast({ 
  open, 
  message, 
  severity, 
  onClose, 
  autoHideDuration = 6000 
}: ToastProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert 
        onClose={onClose} 
        severity={severity} 
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
