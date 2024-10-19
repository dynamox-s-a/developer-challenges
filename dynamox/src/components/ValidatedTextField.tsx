import React from "react";
import { TextField } from "@mui/material";
import { FieldError, UseFormRegister } from "react-hook-form";

type ValidatedTextFieldProps = {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  defaultValue?: string;
  fullWidth?: boolean;
  hidden?: boolean;
};

const ValidatedTextField: React.FC<ValidatedTextFieldProps> = ({
  label,
  name,
  register,
  error,
  defaultValue = "",
  fullWidth = false,
  hidden = false,
}) => {
  return (
    <>
      <TextField
        label={label}
        defaultValue={defaultValue}
        {...register(name)}
        error={!!error}
        helperText={error?.message?.toString()}
        fullWidth={fullWidth}
        style={{ display: hidden ? "none" : "block" }}
      />
    </>
  );
};

export default ValidatedTextField;
