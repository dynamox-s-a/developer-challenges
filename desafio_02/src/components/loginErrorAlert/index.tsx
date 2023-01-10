import React from "react";
import { Stack, Alert } from "@mui/material";
import { ErrorAlertProps } from "../../interfaces/IWrongInfo";
import "./loginErrorAlert.css";

export function LoginErrorAlert(props: ErrorAlertProps): JSX.Element {
  return (
    <Stack spacing={2} className="errorStack">
      <Alert severity="error">{props.errorMessage}</Alert>
    </Stack>
  );
}
