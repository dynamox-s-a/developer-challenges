'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
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
import { signIn } from '@/store/authSlice';
import { RootState } from '@/store/store';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'

const schema = zod.object({
  email: zod.string().min(1, { message: 'Email is required' }).email(),
  password: zod.string().min(1, { message: 'Password is required' }),
});

type Values = zod.infer<typeof schema>;

export function SignInForm(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { error, isLoading } = useAppSelector((state: RootState) => state.auth);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  const { control, handleSubmit, formState: { errors } } = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: Values) => {
    const resultAction = await dispatch(signIn(values));
      if (signIn.fulfilled.match(resultAction)) {
        router.push('/dashboard');
    } else {
      const errorMessage = resultAction.payload as string;
      console.log("Error:", errorMessage);
    }
  };

  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="h4">Sign in</Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)}>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput {...field} label="Email address" type="email" />
                {errors.email && <FormHelperText>{errors.email.message}</FormHelperText>}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)}>
                <InputLabel>Password</InputLabel>
                <OutlinedInput
                  {...field}
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    showPassword ? (
                      <EyeIcon onClick={() => setShowPassword(false)} />
                    ) : (
                      <EyeSlashIcon onClick={() => setShowPassword(true)} />
                    )
                  }
                />
                {errors.password && <FormHelperText>{errors.password.message}</FormHelperText>}
              </FormControl>
            )}
          />
          {error && <Alert severity="error">{error}</Alert>}
          <Button disabled={isLoading} type="submit" variant="contained">
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </Stack>
      </form>
      <Typography variant="h5">Não possui uma conta? Faça seu cadastro <Link href="/auth/sign-up">aqui</Link></Typography>
    </Stack>
  );
}
