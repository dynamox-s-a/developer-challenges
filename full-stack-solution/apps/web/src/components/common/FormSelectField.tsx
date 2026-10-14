import MenuItem from "@mui/material/MenuItem";
import TextField, { type TextFieldProps } from "@mui/material/TextField";
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

export interface SelectOption {
  value: string;
  label: string;
  /** Disabled options stay visible with an explanation (e.g. a blocked sensor). */
  disabled?: boolean;
  description?: string;
}

export type FormSelectFieldProps<Values extends FieldValues> = {
  control: Control<Values>;
  name: FieldPath<Values>;
  options: SelectOption[];
  helperText?: string;
} & Omit<
  TextFieldProps,
  "name" | "value" | "onChange" | "error" | "helperText" | "select"
>;

/**
 * Select built on `TextField` and wired to react-hook-form.
 *
 * Options can be disabled instead of hidden, which is how the Pump sensor rule
 * is surfaced: the user sees the model and why it cannot be used.
 */
export function FormSelectField<Values extends FieldValues>({
  control,
  name,
  options,
  helperText,
  ...textFieldProps
}: FormSelectFieldProps<Values>) {
  const { field, fieldState } = useController({ control, name });

  return (
    <TextField
      {...textFieldProps}
      {...field}
      value={field.value ?? ""}
      select
      error={Boolean(fieldState.error)}
      helperText={fieldState.error?.message ?? helperText}
      fullWidth
    >
      {options.map((option) => (
        <MenuItem
          key={option.value}
          value={option.value}
          disabled={option.disabled}
        >
          {option.label}
          {option.description ? ` — ${option.description}` : ""}
        </MenuItem>
      ))}
    </TextField>
  );
}
