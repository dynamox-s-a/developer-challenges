import axios from 'axios';
import validator from 'validator';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Link,
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import MyCopyright from './components/MyCopyright';

export default function SignIn() {
  const n = useNavigate();
  const [showPass, setShow] = useState(false);
  const [invalidEmail, setInvEmail] = useState(false);
  const [invalidPass, setInvPass] = useState(false);

  const signInFail = (error: string) => {
    console.log('Sign in failed: ', error);
    alert('Sign in Failed. Try again later.');
  };

  const signInSuccess = (loginData: string) => {
    console.log('Sign in success: ', loginData);
    n('/machines');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);

    setInvEmail(!validator.isEmail(`${d.get('email')}`));
    setInvPass(
      `${d.get('password')}`.length < 8 ||
        `${d.get('password')}` != `${d.get('pass')}`
    );

    const signData: SignInParams = {
      name: `${d.get('firstName')} ${d.get('lastName')}`,
      email: `${d.get('email')}`,
      password: `${d.get('password')}`,
    };

    if (
      signData.name.length > 2 &&
      signData.password.length > 7 &&
      !invalidEmail &&
      !invalidPass
    ) {
      console.log('sign up:', signData);
      signin(signData, signInSuccess, signInFail);
    }
  };

  const handleShowPass = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShow(e.target.checked);
  };

  return (
    <Container component={'main'} maxWidth="xs">
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
          Sign up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                error={invalidEmail}
                onChange={() => setInvEmail(false)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type={!showPass ? 'password' : 'text'}
                id="password"
                error={invalidPass}
                onChange={() => setInvPass(false)}
                helperText={invalidPass && 'Must be at least 8 characters'}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="pass"
                label="Confirm password"
                type={!showPass ? 'password' : 'text'}
                id="pass"
                error={invalidPass}
                onChange={() => setInvPass(false)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox color="primary" onChange={handleShowPass} />}
                label="Show Password"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <MyCopyright />
    </Container>
  );
}

type SignInParams = { name: string; email: string; password: string };
function signin(
  { name, email, password }: SignInParams,
  okFunc = console.log,
  errFunc = console.log
) {
  const data = JSON.stringify({
    name,
    email,
    password,
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://localhost:3001/users',
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
