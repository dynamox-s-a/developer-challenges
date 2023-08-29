import { useCallback, useEffect } from 'react';
import Button from 'components/button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import { useAppDispatch, useAppSelector } from 'store/store';
import { deleteMachine } from 'store/features/machines-slice';
import usePrevious from 'hooks/use-previous';

type DeleteMachineDialogTypes = {
  handleClose: () => void;
  machineId: string | number;
};

const DeleteMachineDialog = ({
  handleClose,
  machineId,
}: DeleteMachineDialogTypes) => {
  const dispatch = useAppDispatch();
  const deleteMachineError = useAppSelector(
    (state) => state.error.deleteMachine
  );
  const isLoading = useAppSelector((state) => state.loading.deleteMachine);
  const wasLoading = usePrevious(isLoading);

  const onAddClick = useCallback(() => {
    dispatch(deleteMachine(machineId));
  }, [dispatch, machineId]);

  useEffect(() => {
    if (wasLoading && !isLoading) {
      if (deleteMachineError) {
        // Handle Error
      } else {
        handleClose();
      }
    }
  }, [deleteMachineError, handleClose, isLoading, wasLoading]);

  return (
    <Dialog open onClose={handleClose}>
      <DialogTitle>Delete machine</DialogTitle>
      <DialogContent sx={{ width: '400px' }}>
        <Typography>Are you sure you want to delete this machine?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          color="primary"
          variant="contained"
          onClick={onAddClick}
          isLoading={isLoading}
          loadingSize={16}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteMachineDialog;
