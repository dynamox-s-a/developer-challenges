import EmailIcon from "@mui/icons-material/Email";
import ErrorIcon from "@mui/icons-material/Error";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import * as St from "./styles";

interface ITextFieldProps {
  formRef: {
    name: string;
    formHook: UseFormReturn<any>;
  };
  label: string;
}

export default function LoginField({ formRef, label }: ITextFieldProps) {
  const { formHook, name } = formRef;
  const { register, formState } = formHook;
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const error = formState.errors[name];

  const iconType = () => {
    if (name === "email") return <EmailIcon />;
    if (name === "password") {
      return (
        <IconButton
          aria-label="toggle password visibility"
          onClick={() => setShowPassword(!showPassword)}
          edge="end"
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      );
    }
  };

  return (
    <div>
      <FormControl variant="standard">
        <InputLabel htmlFor={name}>{label}</InputLabel>
        <Input
          type={name === "password" && !showPassword ? "password" : "text"}
          error={!!error}
          autoComplete="off"
          {...register(name, {
            required: "Este campo é obrigatório",
            pattern: {
              value: name === "email" ? /\S+@\S+\.\S+/ : /[\w\d]+/,
              message: name === "email" ? "Insira um e-mail válido" : "",
            },
          })}
          name={name}
          id={name}
          endAdornment={
            <InputAdornment position="end">{iconType()}</InputAdornment>
          }
        />
      </FormControl>
      {error && (
        <St.ErrorMessage>
          <ErrorIcon color="error" fontSize="small" />
          <p>{error.message as string} </p>
        </St.ErrorMessage>
      )}
    </div>
  );
}
