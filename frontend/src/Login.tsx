import axios from 'axios';
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
import MyCopyright from './components/MyCopyright';

export default function Login() {
  const auth = useAuth();
  const n = useNavigate();
  const { state } = useLocation();
  const [data, setEP] = useState({ email: '', password: '', showPass: false });
  const { email, password, showPass } = data;
  const setEmail = (value: string) => setEP({ ...data, email: value });
  const setPassword = (value: string) => setEP({ ...data, password: value });

  const loginFail = (error: string) => {
    console.log('Login failed: ', error);
    setPassword('');
    alert('Login Failed. Try again later.');
  };

  const loginSuccess = (loginData: string) => {
    console.log('Login success: ', loginData);
    const user = JSON.parse(loginData);
    auth!.login(user).then(() => n(state?.path || '/machines'));
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(email, password, loginSuccess, loginFail);
  };

  const handleShowPass = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEP({ ...data, showPass: e.target.checked });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
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
            onChange={({ target: { value } }) => setEmail(value)}
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
            onChange={({ target: { value } }) => setPassword(value)}
          />
          <FormControlLabel
            control={<Checkbox color="primary" onChange={handleShowPass} />}
            label="Show Password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
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

function login(
  email: string,
  password: string,
  okFunc = console.log,
  errFunc = console.log
) {
  const data = JSON.stringify({
    email,
    password,
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://localhost:3001/login',
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };

  axios
    .request(config)
    .then((response) => {
      okFunc(JSON.stringify(response.data));
    })
    .catch((error) => {
      errFunc(error);
    });
}
