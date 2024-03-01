import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { createMachine } from '../actions';

export enum MachineTypes {
  PUMP = 'Pump',
  FAN = 'Fan',
}

export enum MachineStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MachineFormProps {}
const MachineCreationForm: React.FC<MachineFormProps> = (params) => {
  const [creationResult, setCreationResult] = React.useState('');
  const [state, setState] = React.useState<{
    name: string;
    type: MachineTypes | string;
    status: MachineStatus | string;
  }>({
    name: '',
    type: '',
    status: '',
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createMachine,
    onSuccess: () => setCreationResult('Máquina criada com sucesso.'),
    onError: (error) => console.log(error),
  });

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      name: event.target.value,
    });
  };

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    setState({
      ...state,
      type: event.target.value as MachineTypes,
    });
  };

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setState({
      ...state,
      status: event.target.value as MachineStatus,
    });
  };

  const createMachineTrigger = () => {
    mutate({ machine: state });
    return;
  };

  const creationBlocked = state.name === '' || state.type === '';

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
          createMachineTrigger();
        }}
        sx={{ gap: 6, flexDirection: 'row' }}
      >
        <FormLabel component="legend">Create machine</FormLabel>
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
                onChange={handleNameChange}
              />
            }
            label="name"
            labelPlacement="start"
            sx={{ gap: 1 }}
          />
          <Stack direction={'row'} width={350}>
            <FormControlLabel
              control={
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={state.type}
                  label="Type"
                  required
                  onChange={handleTypeChange}
                  sx={{ width: 100 }}
                >
                  {Object.values(MachineTypes).map((type, index) => (
                    <MenuItem key={index} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              }
              label="type"
              labelPlacement="start"
              sx={{ gap: 1 }}
            />
            <FormControlLabel
              control={
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={state.status}
                  label="Status"
                  required
                  onChange={handleStatusChange}
                  sx={{ width: 100 }}
                >
                  {Object.keys(MachineStatus).map((status, index) => (
                    <MenuItem key={index} value={status}>
                      {/* @ts-expect-error: Unreachable code error */}
                      {MachineStatus[status as MachineStatus]}
                    </MenuItem>
                  ))}
                </Select>
              }
              label="status"
              labelPlacement="start"
              sx={{ gap: 1 }}
            />
          </Stack>
        </FormGroup>
        <Button
          type="submit"
          variant="contained"
          disabled={creationBlocked}
          sx={{ mr: 1, width: 200, height: 80, alignSelf: 'center' }}
        >
          Create
        </Button>
        <FormHelperText>{creationResult}</FormHelperText>
      </FormControl>
    </Paper>
  );
};

export default MachineCreationForm;
