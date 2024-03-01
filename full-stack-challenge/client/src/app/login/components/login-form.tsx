import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import React from 'react';
import { signIn } from '../actions';

export interface LoginFormProps {
  signIn: (params: { email: string; password: string }) => void;
}
const LoginForm: React.FC<LoginFormProps> = (params) => {
  const [state, setState] = React.useState({
    email: '',
    password: '',
  });

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      email: event.target.value,
    });
  };

  const handlePaswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      password: event.target.value,
    });
  };
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
        onSubmit={() => signIn(state)}
        sx={{ gap: 6, flexDirection: 'row' }}
      >
        <FormLabel component="legend">Login</FormLabel>
        <FormGroup sx={{ gap: 2, flexDirection: 'column' }}>
          <FormControlLabel
            control={
              <TextField
                required
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: 'default' },
                }}
                variant="filled"
                onChange={handleEmailChange}
              />
            }
            label="email"
            labelPlacement="start"
            sx={{ gap: 1 }}
          />
          <FormControlLabel
            control={
              <TextField
                required
                type="password"
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: 'default' },
                }}
                variant="filled"
                onChange={handlePaswordChange}
              />
            }
            label="password"
            labelPlacement="start"
            sx={{ gap: 1 }}
          />
        </FormGroup>
        <Button
          type="submit"
          variant="contained"
          sx={{ mr: 1, width: 200, height: 80, alignSelf: 'center' }}
        >
          Login
        </Button>
        <FormHelperText></FormHelperText>
      </FormControl>
    </Paper>
  );
};

export default LoginForm;
