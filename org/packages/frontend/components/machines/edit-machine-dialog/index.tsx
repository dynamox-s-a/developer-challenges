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
import { Box, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'store/store';
import { editMachine } from 'store/features/machines-slice';
import { MACHINE_OPTIONS, MachineType } from 'utils/constants';
import usePrevious from 'hooks/use-previous';

type EditMachineDialogTypes = {
  handleClose: () => void;
  initialState: {
    name: string;
    type: MachineType;
  };
  id: number | string;
  shouldEditType: boolean;
};

const EditMachineDialog = ({
  handleClose,
  initialState,
  id,
  shouldEditType,
}: EditMachineDialogTypes) => {
  const dispatch = useAppDispatch();
  const editMachineError = useAppSelector((state) => state.error.editMachine);
  const isLoading = useAppSelector((state) => state.loading.editMachine);
  const wasLoading = usePrevious(isLoading);

  const [name, setName] = useState(initialState.name);
  const [type, setType] = useState<MachineType>(initialState.type);

  const handleChange = useCallback((event: SelectChangeEvent) => {
    setType(event.target.value as MachineType);
  }, []);

  const onChangeName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setName(event.target.value as string);
    },
    []
  );

  const onAddClick = useCallback(() => {
    const payload = {
      id,
      name,
      type,
    };

    dispatch(editMachine(payload));
  }, [dispatch, id, name, type]);

  useEffect(() => {
    if (wasLoading && !isLoading) {
      if (editMachineError) {
        // Handle Error
      } else {
        handleClose();
      }
    }
  }, [editMachineError, handleClose, isLoading, wasLoading]);

  return (
    <Dialog open onClose={handleClose}>
      <DialogTitle>Edit machine</DialogTitle>
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
          <InputLabel id="type-select-label">Machine Type</InputLabel>
          <Select
            labelId="type-select-label"
            id="type-select"
            value={type}
            label="Machine Type"
            onChange={handleChange}
            disabled={!shouldEditType}
          >
            {MACHINE_OPTIONS.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
          {!shouldEditType && (
            <Typography color="gray">
              Can&apos;t edit machine type if it&apos;s Fan and has a sensor
              model as TcAg or TcAs
            </Typography>
          )}
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
          Edit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditMachineDialog;
