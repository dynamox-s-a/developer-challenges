import { FormControl, FormHelperText, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import { Controller } from 'react-hook-form';

import type { IFormField } from './form-component';

type FormFieldProps = {
  control: any;
  field: IFormField;
  error: any;
};

export function FormField({ control, field, error }: FormFieldProps): React.JSX.Element {
  return (
    <Controller
      control={control}
      name={field.name}
      render={({ field: fieldProps }) => (
        <FormControl error={Boolean(error)}>
          <InputLabel>{field.label}</InputLabel>
          {field.type === 'select' ? (
            <Select {...fieldProps} label={field.label}>
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          ) : (
            <OutlinedInput {...fieldProps} label={field.label} />
          )}
          {error ? <FormHelperText>{error.message}</FormHelperText> : null}
        </FormControl>
      )}
    />
  );
}
