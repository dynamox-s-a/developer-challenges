import { Alert, Typography } from "@mui/material";

export default function AlertMessage({ message }: { message: string }) {
  return (
    <Alert severity="error" sx={{ mb: 3 }}>
      <Typography variant="body2">{message}</Typography>
    </Alert>
  );
}
