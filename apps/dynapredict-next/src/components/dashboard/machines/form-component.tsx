'use client';

import * as React from 'react';
import {
  Alert,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { Controller, UseFormReturn } from 'react-hook-form';
import { z as zod } from 'zod';

export const machineTypes = ['Pump', 'Fan'] as const;

export const schema = zod.object({
  name: zod.string().min(1, { message: 'Machine name is required' }),
  type: zod.enum(machineTypes),
});

export type MachineFormValues = zod.infer<typeof schema>;

export const defaultValues: MachineFormValues = {
  name: '',
  type: 'Pump',
};

type MachineFormProps = {
  form: UseFormReturn<MachineFormValues>;
  onSubmit: (values: MachineFormValues) => Promise<void>;
  isLoading: boolean;
  title: string;
  description: string;
  submitText: string;
  cardProps?: React.ComponentProps<typeof Card>;
};

export function MachineForm({
  form,
  onSubmit,
  isLoading,
  title,
  description,
  submitText,
  cardProps,
}: MachineFormProps): React.JSX.Element {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <Card {...cardProps}>
      <CardContent>
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="h5" fontWeight={600}>
              {title}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {description}
            </Typography>
          </Stack>

          <form onSubmit={handleSubmit(onSubmit)}>
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
                      {machineTypes.map((type) => (
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

              <Button
                disabled={isLoading}
                type="submit"
                variant="contained"
                fullWidth
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isLoading ? `${submitText}...` : submitText}
              </Button>
            </Stack>
          </form>
        </Stack>
      </CardContent>
    </Card>
  );
}
