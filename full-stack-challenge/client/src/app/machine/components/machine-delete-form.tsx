import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { deleteMachine } from '../actions';
import DeleteModal from './delete-modal';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MachineFormProps {}
const MachineDeleteForm: React.FC<MachineFormProps> = (params) => {
  const [updateResult, setUpdateResult] = React.useState('');
  const [state, setState] = React.useState<{
    _id: string;
  }>({
    _id: '',
  });

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { mutate, isPending } = useMutation({
    mutationFn: deleteMachine,
    onSuccess: () => {
      handleClose();
      setUpdateResult('Máquina excluída com sucesso.');
      setTimeout(() => {
        setUpdateResult('');
        setState({
          _id: '',
        });
      }, 5000);
    },
    onError: (error) => console.log(error),
  });

  const handleIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      _id: event.target.value,
    });
  };

  const deleteMachineTrigger = () => {
    mutate({ _id: state._id });

    return;
  };

  const deleteBlocked = state._id === '';

  return (
    <Paper
      sx={{
        maxWidth: 936,
        margin: 'auto',
        overflow: 'hidden',
        width: 800,
        alignItems: 'center',
        padding: 4,
      }}
    >
      <FormControl
        component="form"
        variant="standard"
        onSubmit={(e) => {
          e.preventDefault();
          handleOpen();
        }}
        sx={{ gap: 6, flexDirection: 'row' }}
      >
        <FormLabel component="legend">Delete machine</FormLabel>
        <FormGroup sx={{ gap: 2, flexDirection: 'column' }}>
          <FormControlLabel
            control={
              <TextField
                required
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    fontSize: 'default',
                    alignSelf: 'flex-start',
                    justifySelf: 'flex-start',
                  },
                }}
                variant="filled"
                onChange={handleIdChange}
              />
            }
            label="id"
            labelPlacement="start"
            sx={{ gap: 1 }}
          />
        </FormGroup>
        <Button
          type="submit"
          variant="contained"
          disabled={deleteBlocked}
          color="error"
          sx={{ mr: 1, width: 200, height: 80, alignSelf: 'center' }}
        >
          Delete
        </Button>
      </FormControl>

      <DeleteModal
        open={open}
        handleClose={handleClose}
        sendConfirmation={deleteMachineTrigger}
      />
      <FormHelperText sx={{ textAlign: 'end' }}>{updateResult}</FormHelperText>
    </Paper>
  );
};

export default MachineDeleteForm;
