import Button from 'components/button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Typography } from '@mui/material';

type DeleteMachineWarningDialogTypes = {
  handleClose: () => void;
};

const DeleteMachineWarningDialog = ({
  handleClose,
}: DeleteMachineWarningDialogTypes) => {
  return (
    <Dialog open onClose={handleClose}>
      <DialogTitle>Machine currently in use!</DialogTitle>
      <DialogContent sx={{ width: '400px' }}>
        <Typography>
          The machine you selected has monitoring points set to it. This means
          it&apos;s currently in use and can&apos;t be deleted.
        </Typography>
        <Typography>
          You must first remove all related monitoring points.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>OK</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteMachineWarningDialog;
