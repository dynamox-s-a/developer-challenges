import { useState, useCallback, useEffect } from 'react';
import Button from 'components/button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Box } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'store/store';
import { addMachine } from 'store/features/machines-slice';
import { MACHINE_OPTIONS } from 'utils/constants';
import usePrevious from 'hooks/use-previous';

type AddMachineDialogTypes = {
  handleClose: () => void;
};

const AddMachineDialog = ({ handleClose }: AddMachineDialogTypes) => {
  const dispatch = useAppDispatch();
  const addMachineError = useAppSelector((state) => state.error.addMachine);
  const isLoading = useAppSelector((state) => state.loading.addMachine);
  const wasLoading = usePrevious(isLoading);

  const [name, setName] = useState('');
  const [type, setType] = useState('');

  const handleChange = useCallback((event: SelectChangeEvent) => {
    setType(event.target.value as string);
  }, []);

  const onChangeName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setName(event.target.value as string);
    },
    []
  );

  const onAddClick = useCallback(() => {
    const payload = {
      name,
      type,
    };

    dispatch(addMachine(payload));
  }, [dispatch, name, type]);

  useEffect(() => {
    if (wasLoading && !isLoading) {
      if (addMachineError) {
        // Handle Error
      } else {
        handleClose();
      }
    }
  }, [addMachineError, handleClose, isLoading, wasLoading]);

  return (
    <Dialog open onClose={handleClose}>
      <DialogTitle>Add new machine</DialogTitle>
      <DialogContent sx={{ width: '400px' }}>
        <Box
          sx={{
            padding: '12px 0',
          }}
        >
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="name"
            fullWidth
            value={name}
            onChange={onChangeName}
            variant="outlined"
          />
        </Box>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Age</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={type}
            label="Age"
            onChange={handleChange}
          >
            {MACHINE_OPTIONS.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          color="primary"
          variant="contained"
          onClick={onAddClick}
          isLoading={isLoading}
          loadingSize={16}
          disabled={!name || !type}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMachineDialog;
