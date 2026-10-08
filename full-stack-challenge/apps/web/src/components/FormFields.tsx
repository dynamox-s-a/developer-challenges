import { TextField, type TextFieldProps } from '@mui/material';
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from 'react-hook-form';

type BaseProps<T extends FieldValues> = Omit<
  TextFieldProps,
  'name' | 'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'error'
> & {
  control: Control<T>;
  name: Path<T>;
  rules?: RegisterOptions<T, Path<T>>;
};

/**
 * A MUI TextField bound to react-hook-form. The validation message becomes
 * the helper text, which MUI links to the input through aria-describedby,
 * and the field gets aria-invalid, so errors are announced.
 */
export function FormTextField<T extends FieldValues>({
  control,
  name,
  rules,
  helperText,
  id,
  ...props
}: BaseProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { ref, ...field }, fieldState }) => (
        <TextField
          fullWidth
          {...props}
          {...field}
          id={id ?? `field-${name}`}
          inputRef={ref}
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message ?? helperText}
        />
      )}
    />
  );
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * A native select: the OS picker is the easiest choice on touch screens and
 * works with the keyboard everywhere.
 */
export function FormSelect<T extends FieldValues>({
  options,
  ...props
}: BaseProps<T> & { options: readonly SelectOption[] }) {
  return (
    <FormTextField
      {...props}
      select
      SelectProps={{ native: true }}
      InputLabelProps={{ shrink: true }}
    >
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          disabled={option.disabled}
        >
          {option.label}
        </option>
      ))}
    </FormTextField>
  );
}
