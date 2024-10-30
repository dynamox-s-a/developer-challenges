'use client';

import * as React from 'react';
import { Alert, Button, Card, CardContent, CircularProgress, Stack, Typography } from '@mui/material';
import { FieldValues, UseFormReturn } from 'react-hook-form';

import { FormField } from './form-field';

export interface IFormField {
  name: string;
  label: string;
  type: 'text' | 'select';
  options?: Array<{ value: string; label: string }>;
}

type GenericFormProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  onSubmit: (values: T) => Promise<void>;
  isLoading: boolean;
  title: string;
  description: string;
  submitText: string;
  fields: IFormField[];
  cardProps?: React.ComponentProps<typeof Card>;
};

export function GenericForm<T extends FieldValues>({
  form,
  onSubmit,
  isLoading,
  title,
  description,
  submitText,
  fields,
  cardProps,
}: GenericFormProps<T>): React.JSX.Element {
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
              {fields.map((field) => (
                <FormField key={field.name} control={control} field={field} error={errors[field.name as keyof T]} />
              ))}

              {errors.root ? <Alert color="error">{(errors.root as any).message}</Alert> : null}

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
