import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material"

interface ErrorModalProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

export function ErrorModal({ open, message, onClose }: ErrorModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle color="error">Erro</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="error">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}