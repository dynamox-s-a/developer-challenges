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
import ValidatedTextField from "../ValidatedTextField";
import { MachineFormValidation } from "@/src/lib/validation";
import { useFormState } from "react-dom";
import { createMachine, updateMachine } from "@/src/lib/actions";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type Inputs = z.infer<typeof MachineFormValidation>;

const MachineForm = ({
  type,
  data,
  setOpen,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(MachineFormValidation),
  });

  const [state, formAction] = useFormState(
    type === "create" ? createMachine : updateMachine,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((formData) => {
    const updatedData = {
      ...formData,
      id: data?.id,
    };
    formAction(updatedData);
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success(
        `Machine has been ${type === "create" ? "created" : "updated"}!`
      );
      setOpen(false);
      router.refresh();
    }
  }, [state.success, setOpen, router, type]);

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
