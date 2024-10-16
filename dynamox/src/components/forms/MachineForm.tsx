"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Box,
} from "@mui/material";

const schema = z.object({
  name: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  type: z.enum(["Fan", "Pump"], { message: "Type is required!" }),
});

type Inputs = z.infer<typeof schema>;

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
    resolver: zodResolver(schema),
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
        <TextField
          label="Name"
          defaultValue={data?.name}
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
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
            <MenuItem value="pump">Pump</MenuItem>
            <MenuItem value="fan">Fan</MenuItem>
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
