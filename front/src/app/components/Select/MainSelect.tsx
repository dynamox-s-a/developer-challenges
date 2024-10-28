import {
  FormControl,
  FormHelperText,
  Grid,
  GridOwnProps,
  InputLabel,
  Select,
  SelectProps,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

type IProps = {
  name: string;
  label?: string;
  gridProps?: GridOwnProps;
  requerido?: boolean;
};

export type Props = IProps & SelectProps;

export default function MainSelect({
  name,
  label,
  gridProps,
  requerido,
  children,
  ...other
}: Props) {
  const { control, setValue, getValues, trigger } = useFormContext();

  return (
    <Grid item xs={12} {...gridProps}>
      <Controller
        name={name}
        control={control}
        defaultValue={""}
        render={({ field, fieldState: { error } }) => (
          <FormControl sx={{ minWidth: "100%" }} focused={requerido} fullWidth>
            <InputLabel
              sx={{ width: "100%" }}
              id="selectLabel"
              error={!!error || !!other.error}
            >
              {label}
            </InputLabel>
            <Select
              id={"mainSelect_" + name}
              label={label}
              sx={{ minWidth: "100%" }}
              {...field}
              required={requerido}
              fullWidth
              placeholder={""}
              error={!!error}
              {...other}
            >
              {children}
            </Select>
            <FormHelperText
              id={"main_select_" + name + "_helperText"}
              error={!!error}
            >
              {error?.message}
            </FormHelperText>
          </FormControl>
        )}
      />
    </Grid>
  );
}
