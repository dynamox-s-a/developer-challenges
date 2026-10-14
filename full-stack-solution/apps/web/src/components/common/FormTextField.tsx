import TextField, { type TextFieldProps } from "@mui/material/TextField";
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

export type FormTextFieldProps<Values extends FieldValues> = {
  control: Control<Values>;
  name: FieldPath<Values>;
} & Omit<TextFieldProps, "name" | "value" | "onChange" | "error" | "helperText">;

/**
 * `TextField` wired to react-hook-form.
 *
 * Centralizes the error/helper-text plumbing so every form in the app reports
 * validation the same way.
 */
export function FormTextField<Values extends FieldValues>({
  control,
  name,
  helperText,
  ...textFieldProps
}: FormTextFieldProps<Values> & { helperText?: string }) {
  const { field, fieldState } = useController({ control, name });

  return (
    <TextField
      {...textFieldProps}
      {...field}
      value={field.value ?? ""}
      error={Boolean(fieldState.error)}
      helperText={fieldState.error?.message ?? helperText}
      fullWidth
    />
  );
}
