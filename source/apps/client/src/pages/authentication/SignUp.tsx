import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconifyIcon from 'components/base/IconifyIcon';
import paths from 'routes/paths';
import PageTitle from 'components/common/PageTitle';

interface User {
  [key: string]: string;
}

const SignUp = () => {
  const { status } = useSession();
  const navigate = useNavigate();
  const [user, setUser] = useState<User>({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      navigate('/');
    }
  }, [status, navigate]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(user);
  };

  return (
    <>
      <PageTitle title="Sign Up" />
      <Stack
        mx="auto"
        width={410}
        height="auto"
        minHeight={800}
        direction="column"
        alignItems="center"
        justifyContent="space-between"
      >
      <Box width={1}>
        <Button
          variant="text"
          component={Link}
          href="/"
          sx={{ ml: -1.75, pl: 1, pr: 2 }}
          startIcon={
            <IconifyIcon
              icon="ic:round-keyboard-arrow-left"
              sx={(theme) => ({ fontSize: `${theme.typography.h3.fontSize} !important` })}
            />
          }
        >
          Back to dashboard
        </Button>
      </Box>

      <Box width={1}>
        <Typography variant="h3">Sign Up</Typography>
        <Typography mt={1.5} mb={3.5} variant="body2" color="text.secondary">
          Join us and start your journey today!
        </Typography>

        {/* <Button
          variant="contained"
          color="secondary"
          size="large"
          fullWidth
          startIcon={<IconifyIcon icon="logos:google-icon" />}
          sx={{
            mt: 4,
            fontWeight: 600,
            bgcolor: 'neutral.main',
            '& .MuiButton-startIcon': { mr: 1.5 },
            '&:hover': { bgcolor: 'neutral.main' },
          }}
        >
          Sign up with Google
        </Button>

        <Divider sx={{ my: 3 }}>or</Divider> */}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            id="name"
            name="name"
            type="text"
            label="Name"
            value={user.name}
            onChange={handleInputChange}
            variant="filled"
            placeholder="Your Name"
            autoComplete="name"
            sx={{ mt: 3 }}
            fullWidth
            autoFocus
            required
          />
          <TextField
            id="email"
            name="email"
            type="email"
            label="Email"
            value={user.email}
            onChange={handleInputChange}
            variant="filled"
            placeholder="mail@example.com"
            autoComplete="email"
            sx={{ mt: 6 }}
            fullWidth
            required
          />
          <TextField
            id="password"
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={user.password}
            onChange={handleInputChange}
            variant="filled"
            placeholder="Min. 8 characters"
            autoComplete="current-password"
            sx={{ mt: 6 }}
            fullWidth
            required
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position="end"
                  sx={{
                    opacity: user.password ? 1 : 0,
                    pointerEvents: user.password ? 'auto' : 'none',
                  }}
                >
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    sx={{ border: 'none', bgcolor: 'transparent !important' }}
                    edge="end"
                  >
                    <IconifyIcon
                      icon={showPassword ? 'ic:outline-visibility' : 'ic:outline-visibility-off'}
                      color="neutral.main"
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button type="submit" variant="contained" size="large" sx={{ mt: 3 }} fullWidth>
            Sign Up
          </Button>
        </Box>

        <Typography
          mt={3}
          variant="body2"
          textAlign={{ xs: 'center', md: 'left' }}
          letterSpacing={0.25}
        >
          Already have an account?{' '}
          <Link href={paths.signin} color="primary.main" fontWeight={600}>
            Let's Sign in
          </Link>
        </Typography>
      </Box>

      <Typography variant="body2" color="text.disabled" fontWeight={500}>
        © 2024 Horizon UI. Made with ❤️ by{' '}
        <Link href="https://themewagon.com/" target="_blank" rel="noreferrer" fontWeight={600}>
          {'ThemeWagon'}
        </Link>{' '}
      </Typography>
    </Stack>
  </>
);
};

export default SignUp;
