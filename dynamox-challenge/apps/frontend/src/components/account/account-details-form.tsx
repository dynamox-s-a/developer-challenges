'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useSelector } from 'react-redux';
import { selectUser } from '@/store/auth/auth.slice';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { z as zod } from 'zod';
import { useUpdateProfileMutation } from '@/store/auth/auth.api';
import { setUser } from '@/store/auth/auth.slice';
import { useDispatch } from 'react-redux';
import Alert from '@mui/material/Alert';

const schema = zod.object({
  firstName: zod.string().min(1, { message: 'First name is required' }),
  lastName: zod.string().optional(),
  email: zod.string().min(1, { message: 'Email is required' }).email(),
  password: zod.string().min(6, { message: 'Password must be at least 6 characters' }).optional().or(zod.literal('')),
});

type Values = zod.infer<typeof schema>;

export function AccountDetailsForm(): React.JSX.Element {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const [firstName, lastName] = React.useMemo(() => {
    const parts = user?.name?.split(' ') || [];
    const first = parts[0] || '';
    const last = parts.slice(1).join(' ') || '';
    return [first, last];
  }, [user]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Values>({
    defaultValues: {
      firstName: firstName,
      lastName: lastName,
      email: user?.email || '',
      password: '',
    },
    resolver: zodResolver(schema),
  });

  // Update form values when user data loads
  React.useEffect(() => {
    reset({
      firstName: firstName,
      lastName: lastName,
      email: user?.email || '',
      password: '',
    });
  }, [user, firstName, lastName, reset]);

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setSuccessMessage(null);
      setErrorMessage(null);
      try {
        const fullName = `${values.firstName} ${values.lastName || ''}`.trim();
        const updateData: any = {
          name: fullName,
          email: values.email,
        };

        if (values.password && values.password.length >= 6) {
          updateData.password = values.password;
        }

        const updatedUser = await updateProfile(updateData).unwrap();
        dispatch(setUser(updatedUser)); // Update Redux state
        setSuccessMessage('Profile updated successfully');

        // Reset password field
        reset({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: '',
        });
      } catch (err: any) {
        setErrorMessage(
          err?.data?.message || 'Houve um erro ao atualizar a senha. Por favor, tente novamente.'
        );
      }
    },
    [updateProfile, dispatch, reset]
  );

  // Watch password field to control button state
  const passwordValue = useWatch({ control, name: 'password' });
  const isPasswordValid = passwordValue && passwordValue.length >= 6;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader subheader="The information can be edited" title="Profile" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            {/* ... other fields ... */}
            <Grid size={{ md: 6, xs: 12 }}>
              <Controller
                control={control}
                name="firstName"
                render={({ field }) => (
                  <FormControl fullWidth required error={Boolean(errors.firstName)}>
                    <InputLabel>First name</InputLabel>
                    <OutlinedInput {...field} label="First name" disabled />
                    {errors.firstName ? <FormHelperText>{errors.firstName.message}</FormHelperText> : null}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid size={{ md: 6, xs: 12 }}>
              <Controller
                control={control}
                name="lastName"
                render={({ field }) => (
                  <FormControl fullWidth error={Boolean(errors.lastName)}>
                    <InputLabel>Last name</InputLabel>
                    <OutlinedInput {...field} label="Last name" disabled />
                    {errors.lastName ? <FormHelperText>{errors.lastName.message}</FormHelperText> : null}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid size={{ md: 6, xs: 12 }}>
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <FormControl fullWidth required error={Boolean(errors.email)}>
                    <InputLabel>Email address</InputLabel>
                    <OutlinedInput {...field} label="Email address" disabled />
                    {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid size={{ md: 6, xs: 12 }}>
              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <FormControl fullWidth error={Boolean(errors.password)}>
                    <InputLabel>Password (Leave blank to keep current)</InputLabel>
                    <OutlinedInput {...field} type="password" label="Password (Leave blank to keep current)" />
                    {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              {successMessage && <Alert severity="success">{successMessage}</Alert>}
              {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button disabled={isLoading || !isPasswordValid} type="submit" variant="contained">
            {isLoading ? 'Saving...' : 'Save details'}
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}

