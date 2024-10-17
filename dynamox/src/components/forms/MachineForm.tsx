"use client";

import { MachineTypeOptions } from "@/src/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Box,
} from "@mui/material";
import ValidatedTextField from "../InputFiels";
import { MachineFormValidation } from "@/src/lib/validation";

type Inputs = z.infer<typeof MachineFormValidation>;

const MachineForm = ({
  type,
  data,
}: {
  type: "create" | "update";
  data?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(MachineFormValidation),
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  return (
    <Box
      component="form"
      display="flex"
      flexDirection="column"
      gap={2}
      onSubmit={onSubmit}
      sx={{ mt: 3 }}
    >
      <Box display="flex" flexWrap="wrap" gap={2}>
        <ValidatedTextField
          label="Name"
          name="name"
          register={register}
          error={errors.name}
          defaultValue={data?.name}
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel>Type</InputLabel>
          <Select
            defaultValue={data?.type || ""}
            {...register("type")}
            error={!!errors.type}
            label="Type"
          >
            {MachineTypeOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
          {errors.type?.message && (
            <Typography variant="body2" color="error">
              {errors.type.message.toString()}
            </Typography>
          )}
        </FormControl>
      </Box>

      <Button type="submit" variant="contained" color="primary">
        {type === "create" ? "Create" : "Update"}
      </Button>
    </Box>
  );
};

export default MachineForm;
