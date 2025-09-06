import { Paper, Typography } from "@mui/material";

interface ErrorAlertProps {
  message: string;
}

export default function ErrorAlert({ message }: ErrorAlertProps) {
  return (
    <Paper
      sx={{
        p: 2,
        mb: 3,
        bgcolor: "error.light",
        color: "error.contrastText",
      }}
    >
      <Typography>{message}</Typography>
    </Paper>
  );
}