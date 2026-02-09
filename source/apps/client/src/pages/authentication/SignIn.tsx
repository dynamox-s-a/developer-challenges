import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import IconifyIcon from 'components/base/IconifyIcon';
import paths from 'routes/paths';
import { theme } from 'theme/theme';
import PageTitle from 'components/common/PageTitle';

const signInSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type SignInFormData = z.infer<typeof signInSchema>;

const SignInView = () => {
  const { status } = useSession();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    setError(null);

    const result = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <PageTitle title="Sign In" />
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
        <Typography variant="h3">Sign In</Typography>
        <Typography mt={1.5} mb={3.5} variant="body2" color="text.secondary">
          Enter your email and password to sign in!
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
          Sign in with Google
        </Button> */}

        {/* <Divider sx={{ my: 3 }}>or</Divider> */}

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
            autoComplete="current-password"
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

          <Stack mt={1.5} alignItems="center" justifyContent="space-between">
            <FormControlLabel
              control={<Checkbox id="checkbox" name="checkbox" size="medium" color="primary" />}
              label="Keep me logged in"
              sx={{ ml: -0.75 }}
            />
            <Link href="#!" fontSize="body2.fontSize" fontWeight={600}>
              Forgot password?
            </Link>
          </Stack>

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
            sx={{ mt: 3, backgroundColor: theme.palette.secondary.main }}
            fullWidth
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </Button>
        </Box>

        {error && (
          <Typography sx={{ marginTop: 2, fontWeight: '600' }} color="error" variant="body2" textAlign="center">
            Erro: {error}
          </Typography>
        )}

        <Typography
          mt={3}
          variant="body2"
          textAlign={{ xs: 'center', md: 'left' }}
          letterSpacing={0.25}
        >
          Not registered yet?{' '}
          <Link href={paths.signup} color="primary.main" fontWeight={600}>
            Create an Account
          </Link>
        </Typography>
      </Box>

      <Typography variant="body2" color="text.disabled" fontWeight={500}>
        © 2024 Horizon UI. Made with ❤️ by
        <Link href="https://themewagon.com/" target="_blank" rel="noreferrer" fontWeight={600}>
          {' ThemeWagon '}
        </Link>
        and Henry Bastos for Dynamox
      </Typography>
    </Stack>
  </>
);
};

export default SignInView;
