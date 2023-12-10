import MuiAlert, { AlertColor, AlertProps } from "@mui/material/Alert";
import { forwardRef } from "react";

interface IAlertProps {
  error: string;
  type: string;
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props) {
  return <MuiAlert variant="filled" {...props} />;
});

export default function Login({ error, type }: IAlertProps) {
  return <Alert severity={type as AlertColor}>{error}</Alert>;
}
