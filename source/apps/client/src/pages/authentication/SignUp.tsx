import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconifyIcon from 'components/base/IconifyIcon';
import paths from 'routes/paths';
import PageTitle from 'components/common/PageTitle';
import { theme } from 'theme/theme';
import api from 'api/api';

const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const { status } = useSession();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  useEffect(() => {
    if (status === 'authenticated') {
      navigate('/');
    }
  }, [status, navigate]);

  const onSubmit = async (data: SignUpFormData) => {
    setError(null);
    setSuccess(false);

    try {
      const response = await api.post('/auth/signup', {
        email: data.email,
        pass: data.password,
      });

      if (response.data.message && response.data.message.includes('exists')) {
        setError('Este e-mail já está em uso.');
      } else if (response.data.message) {
        setError(response.data.message);
      } else {
        const result = await signIn('credentials', {
          redirect: false,
          email: data.email,
          password: data.password,
        });

        if (result?.error) {
          setError(result.error);
        } else {
          setSuccess(true);
          navigate('/');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ocorreu um erro ao registrar.');
    }
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

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              id="email"
              type="email"
              label="Email"
              variant="filled"
              placeholder="mail@example.com"
              autoComplete="email"
              fullWidth
              autoFocus
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{ mt: 3 }}
            />
            <TextField
              id="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="filled"
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              fullWidth
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              sx={{ mt: 6 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
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

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting}
              sx={{ mt: 3, backgroundColor: theme.palette.secondary.main }}
              fullWidth
            >
              {isSubmitting ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </Box>

          {error && (
            <Typography sx={{ marginTop: 2, fontWeight: '600' }} color="error" variant="body2" textAlign="center">
              Error: {error}
            </Typography>
          )}

          {success && (
            <Typography sx={{ marginTop: 2, fontWeight: '600' }} color="success.main" variant="body2" textAlign="center">
              Account created! Redirecting to sign in...
            </Typography>
          )}

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
          and Henry Bastos for Dynamox
        </Typography>
      </Stack>
    </>
  );
};

export default SignUp;
