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

const schema = zod.object({
  name: zod.string().min(1, { message: 'Monitoring point name is required' }),
  machineId: zod.string().min(1, { message: 'Machine selection is required' }),
});

type Values = zod.infer<typeof schema>;

const defaultValues = {
  name: '',
  machineId: '',
} satisfies Values;

type Machine = {
  id: string;
  name: string;
};

type MonitoringPointsFormProps = {
  machines: Machine[];
};

export function MonitoringPointsForm({ machines }: MonitoringPointsFormProps): React.JSX.Element {
  const [isPending, setIsPending] = React.useState<boolean>(false);

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
        console.log('Form submitted with values:', values);
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
              Add New Monitoring Point
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Fill in the details to add a new monitoring point
            </Typography>
          </Stack>

          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <Stack spacing={3}>
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <FormControl error={Boolean(errors.name)}>
                    <InputLabel>Monitoring Point Name</InputLabel>
                    <OutlinedInput {...field} label="Monitoring Point Name" />
                    {errors.name ? <FormHelperText>{errors.name.message}</FormHelperText> : null}
                  </FormControl>
                )}
              />

              <Controller
                control={control}
                name="machineId"
                render={({ field }) => (
                  <FormControl error={Boolean(errors.machineId)}>
                    <InputLabel>Machine</InputLabel>
                    <Select {...field} label="Machine">
                      {machines.map((machine) => (
                        <MenuItem key={machine.id} value={machine.id}>
                          {machine.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.machineId ? <FormHelperText>{errors.machineId.message}</FormHelperText> : null}
                  </FormControl>
                )}
              />

              {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}

              <Button disabled={isPending} type="submit" variant="contained" fullWidth>
                Add Monitoring Point
              </Button>
            </Stack>
          </form>
        </Stack>
      </CardContent>
    </Card>
  );
}
