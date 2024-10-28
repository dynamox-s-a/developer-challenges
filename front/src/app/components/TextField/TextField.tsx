import { Grid, GridOwnProps, TextFieldProps, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

type IProps = {
  name: string;
  label?: string;
  gridProps?: GridOwnProps;
  tamanhoMaximo?: number;
  requerido?: boolean;
};

export type Props = IProps & TextFieldProps;

export default function MainTextField({
  name,
  label,
  gridProps,
  tamanhoMaximo,
  requerido,
  ...other
}: Props) {
  const { control, trigger } = useFormContext();

  return (
    <Grid item {...gridProps}>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field, fieldState: { error } }) => (
          <TextField
            size="medium"
            id={"textfield_" + name}
            focused={requerido}
            label={label}
            variant="outlined"
            {...field}
            onBlur={() => {
              trigger(name);
            }}
            fullWidth
            error={!!error || !!other.error}
            helperText={error?.message}
            {...other}
          />
        )}
      />
    </Grid>
  );
}
