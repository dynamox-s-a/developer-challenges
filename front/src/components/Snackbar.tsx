import { Alert, Snackbar as MuiSnackbar } from "@mui/material"
import { InputErrorControlType } from "../pages/User/types"

export const Snackbar = ({ 
  onClose, 
  snackbar }: { 
  onClose: () => void, 
  snackbar: InputErrorControlType
}) => {

  return (
    <MuiSnackbar
      open={snackbar.visible}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={onClose}
        severity="success"
        sx={{ width: '100%' }}
      >
        {snackbar?.message}
      </Alert>
    </MuiSnackbar>
  )
}
