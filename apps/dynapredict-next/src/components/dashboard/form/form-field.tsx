import React from 'react';
import { FormControl, FormHelperText, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import { Control, Controller, FieldError, FieldValues, Path } from 'react-hook-form';

import type { FormField } from './form-component';

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  field: FormField;
  error: FieldError | undefined;
}

export function FormField<T extends FieldValues>({ control, field, error }: FormFieldProps<T>): React.JSX.Element {
  const isSelect = field.type === 'select';
  return (
    <Controller
      control={control}
      name={field.name as Path<T>}
      render={({ field: fieldProps }) => (
        <FormControl error={Boolean(error)}>
          <InputLabel>{field.label}</InputLabel>
          {isSelect && (
            <Select {...fieldProps} label={field.label}>
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          )}
          {!isSelect && <OutlinedInput {...fieldProps} label={field.label} />}
          {error ? <FormHelperText>{error.message}</FormHelperText> : null}
        </FormControl>
      )}
    />
  );
}
