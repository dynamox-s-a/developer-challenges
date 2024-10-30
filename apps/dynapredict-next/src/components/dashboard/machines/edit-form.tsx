'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Button,
  Card,
  CardContent,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import type { Machine } from './list-machines';

const schema = zod.object({
  name: zod.string().min(1, { message: 'Machine name is required' }),
  type: zod.string().min(1, { message: 'Machine type is required' }),
});

type Values = zod.infer<typeof schema>;

type EditFormProps = {
  machine: Machine;
  types: string[];
};

export function EditForm({ machine, types }: EditFormProps): React.JSX.Element {
  const [isPending, setIsPending] = React.useState<boolean>(false);

  const defaultValues = {
    name: machine.name,
    type: machine.type,
  } satisfies Values;

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const handleFormSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      try {
        setIsPending(true);
        console.log('Updating machine with values:', values);
      } catch (error) {
        setError('root', {
          type: 'server',
          message: error instanceof Error ? error.message : 'Something went wrong',
        });
      } finally {
        setIsPending(false);
      }
    },
    [setError]
  );

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="h5" fontWeight={600}>
              Edit Machine
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Update the machine details
            </Typography>
          </Stack>

          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <Stack spacing={3}>
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <FormControl error={Boolean(errors.name)}>
                    <InputLabel>Machine Name</InputLabel>
                    <OutlinedInput {...field} label="Machine Name" />
                    {errors.name ? <FormHelperText>{errors.name.message}</FormHelperText> : null}
                  </FormControl>
                )}
              />

              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <FormControl error={Boolean(errors.type)}>
                    <InputLabel>Machine Type</InputLabel>
                    <Select {...field} label="Machine Type">
                      {types.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.type ? <FormHelperText>{errors.type.message}</FormHelperText> : null}
                  </FormControl>
                )}
              />

              {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}

              <Button disabled={isPending} type="submit" variant="contained" fullWidth>
                Update Machine
              </Button>
            </Stack>
          </form>
        </Stack>
      </CardContent>
    </Card>
  );
}
