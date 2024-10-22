import * as React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { authClient } from '../../lib/auth/client';

const schema = zod.object({
  email: zod.string().min(1, { message: 'Email is required' }).email(),
  password: zod.string().min(6, { message: 'Password should be at least 6 characters' }),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { email: '', password: '' } satisfies Values;

export function SignUpForm(): React.JSX.Element {
  const navigate = useNavigate();

  const [isPending, setIsPending] = React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);

      const { error } = await authClient.signUp(values);

      if (error) {
        setError('root', { type: 'server', message: error });
        setIsPending(false);
        return;
      }
      
      navigate('/login');
    },
    [navigate, setError]
  );

  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={3}
      sx={{ height: '80vh', width: '80vw', padding: '16px' }}
    >
      <Stack spacing={1} alignItems="center">
        <Typography variant="h4">Sign up</Typography>
        <Typography color="text.secondary" variant="body2" align="center">
          Já possui uma conta?{' '}
          <Link component={RouterLink} to={'/login'} underline="hover" variant="subtitle2">
            Sign in
          </Link>
        </Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%', maxWidth: '400px' }}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)} fullWidth>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput {...field} label="Email address" type="email" />
                {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)} fullWidth>
                <InputLabel>Password</InputLabel>
                <OutlinedInput {...field} label="Password" type="password" />
                {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
          <Button disabled={isPending} type="submit" variant="contained" fullWidth> 
            Sign up
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
