import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { useLoginMutation } from '@/store/auth/auth.api';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/auth/auth.slice';
import { paths } from '@/paths';

export default function LoginPage(): React.JSX.Element {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await login({ email, password }).unwrap();
      dispatch(setCredentials(response));
      navigate(paths.dashboard.overview);
    } catch (err: any) {
      setError(err?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%', m: 2 }}>
        <CardContent>
          <Stack spacing={3}>
            <Typography variant="h4" fontWeight={700} textAlign="center">
              Login
            </Typography>

            {error && <Alert severity="error">{error}</Alert>}

            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />

                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Login'}
                </Button>
              </Stack>
            </form>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
