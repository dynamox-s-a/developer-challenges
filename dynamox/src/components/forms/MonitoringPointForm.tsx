"use client";

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
import ValidatedTextField from "../ValidatedTextField";
import { MonitoringPointFormValidation } from "@/src/lib/validation";

type Inputs = z.infer<typeof MonitoringPointFormValidation>;

const MonitoringPointForm = ({
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
    resolver: zodResolver(MonitoringPointFormValidation),
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
      </Box>

      <Button type="submit" variant="contained" color="primary">
        {type === "create" ? "Create" : "Update"}
      </Button>
    </Box>
  );
};

export default MonitoringPointForm;
