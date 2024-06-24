import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from './useAuth';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { LoginType, useLoginMutation } from './features/monitor/monitorSlice';
import MyCopyright from './components/MyCopyright';

export default function Login() {
  const auth = useAuth();
  const n = useNavigate();
  const { state } = useLocation();
  const [showPass, setShowPass] = useState(false);
  const [loginFunc] = useLoginMutation();

  const loginFail = (error: string) => {
    console.log('Login failed: ', error);
    alert('Login Failed. Try again later.');
  };

  const loginSuccess = (loginData: string) => {
    console.log('Login success: ', loginData);
    const user = JSON.parse(loginData);
    auth!.login(user).then(() => n(state?.path || '/machines'));
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const user = { email: d.get('email'), password: d.get('password') };
    if (user.email && user.password)
      loginFunc(user as unknown as LoginType)
        .unwrap()
        .then((v) => loginSuccess(JSON.stringify(v)))
        .catch(loginFail);
  };

  const handleShowPass = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowPass(e.target.checked);
  };

  return (
    <Container
      component="main"
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexGrow: 1,
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={!showPass ? 'password' : 'text'}
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox color="primary" onChange={handleShowPass} />}
            label="Show Password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: '2rem', mb: '2rem' }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/sign-in" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/sign-in" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <MyCopyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}
