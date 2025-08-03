import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

export function EditMachineTypeDialogue({ confirmDialogOpen, handleCancelTypeChange, handleConfirmTypeChange, updatingTypeId, pendingTypeChange }: { confirmDialogOpen: boolean, handleCancelTypeChange: () => void, handleConfirmTypeChange: () => void, updatingTypeId: string | null, pendingTypeChange: { machineName: string, newType: string } | null }) {
    return (
     <Dialog open={confirmDialogOpen} onClose={handleCancelTypeChange}>
        <DialogTitle>Confirm Machine Type Change</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to change the machine type for "{pendingTypeChange?.machineName}" 
            to {pendingTypeChange?.newType}?
          </Typography>
          <Typography variant="body2" color="warning.main" sx={{ fontWeight: 'bold' }}>
            ⚠️ Warning: This action will delete all monitoring points associated with this machine, 
            as different machine types have specific sensor types available.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelTypeChange} disabled={updatingTypeId !== null}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmTypeChange} 
            variant="contained" 
            color="warning"
            disabled={updatingTypeId !== null}
          >
            {updatingTypeId !== null ? 'Updating...' : 'Confirm Change'}
          </Button>
        </DialogActions>
      </Dialog>
    );
}