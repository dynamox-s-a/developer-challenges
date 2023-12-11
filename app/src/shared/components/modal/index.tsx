import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { ReactNode } from "react";
import { SetStateFunction } from "../../../types";

interface IModalProps {
  open: boolean;
  setOpen: SetStateFunction<boolean>;
  title: string;
  children: ReactNode;
  button: () => void;
}

export default function ModalDialog({
  open,
  setOpen,
  title,
  children,
  button,
}: IModalProps) {
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={() => setOpen(false)}
      scroll="paper"
    >
      <DialogTitle id="dialog-title">{title}</DialogTitle>
      <DialogContent dividers>{children}</DialogContent>

      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancelar</Button>
        <Button onClick={button}>Apagar</Button>
      </DialogActions>
    </Dialog>
  );
}
