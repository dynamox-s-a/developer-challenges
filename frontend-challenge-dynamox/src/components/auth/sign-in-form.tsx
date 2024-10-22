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
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { RootState, store } from '../../features/store';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../features/user-slice';

const schema = zod.object({
  email: zod.string().min(1, { message: 'Email is required' }).email(),
  password: zod.string().min(1, { message: 'Password is required' }),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { email: 'dynamoxchallenge@email.com', password: 'dynamox123' } satisfies Values;

export function SignInForm(): React.JSX.Element {
  const navigate = useNavigate();
  const dispatch = useDispatch<typeof store.dispatch>();
  const { token, isLogged } = useSelector((state: RootState) => state.auth);

  const [showPassword, setShowPassword] = React.useState<boolean>(false);
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

      const response = await dispatch(loginUser(values));

      if(loginUser.fulfilled.match(response)) {
        setIsPending(false);
      } else {
        setError('root', { type: 'server', message: response.payload as string });
        setIsPending(false);
        return;
      }
    },
    [dispatch, navigate, setError]
  );

  React.useEffect(() => {
    if (isLogged && token) {
      navigate('/dashboard/overview');
    }
  }, [isLogged, token, navigate]);

  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={4}
      sx={{ height: '80vh', width: '80vw', padding: '16px' }}
    >
      <Stack spacing={1} alignItems="center"> 
        <Typography variant="h4">Sign in</Typography>
        <Typography color="text.secondary" variant="body2" align="center">
          Não possui conta?{' '}
          <Link component={RouterLink} to={'/signup'} underline="hover" variant="subtitle2">
            Sign up
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
                <OutlinedInput
                  {...field}
                  endAdornment={
                    showPassword ? (
                      <EyeIcon
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={(): void => {
                          setShowPassword(false);
                        }}
                      />
                    ) : (
                      <EyeSlashIcon
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={(): void => {
                          setShowPassword(true);
                        }}
                      />
                    )
                  }
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                />
                {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
          <Button disabled={isPending} type="submit" variant="contained" fullWidth>
            Sign in
          </Button>
        </Stack>
      </form>
      <Alert color="warning">
        Use{' '}
        <Typography component="span" sx={{ fontWeight: 700 }} variant="inherit">
          dynamoxchallenge@email.com
        </Typography>{' '}
        com senha{' '}
        <Typography component="span" sx={{ fontWeight: 700 }} variant="inherit">
          dynamox123
        </Typography>
      </Alert>
    </Stack>
  );
}
