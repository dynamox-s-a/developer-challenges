"use client";

import {
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Box,
} from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ValidatedTextField from "../ValidatedTextField";
import { MonitoringPointFormValidation } from "@/src/lib/validation";
import { useFormState } from "react-dom";
import {
  createMonitoringPoint,
  updateMonitoringPoint,
} from "@/src/lib/actions";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type Inputs = z.infer<typeof MonitoringPointFormValidation>;

interface MonitoringPointFormProps {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: { machines: { id: string; name: string }[] };
}

const MonitoringPointForm = ({
  type,
  data,
  setOpen,
  relatedData = { machines: [] },
}: MonitoringPointFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(MonitoringPointFormValidation),
  });

  const [state, formAction] = useFormState(
    type === "create" ? createMonitoringPoint : updateMonitoringPoint,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    formAction(data);
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success(
        `Monitoring Point has been ${
          type === "create" ? "created" : "updated"
        }!`
      );
      setOpen(false);
      router.refresh();
    }
  }, [state.success, setOpen, router, type]);

  const { machines } = relatedData;

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

        {data && (
          <ValidatedTextField
            label="Id"
            name="id"
            register={register}
            error={errors.id}
            defaultValue={data?.id}
            fullWidth
            hidden={true}
          />
        )}
        <FormControl fullWidth>
          <InputLabel>Machines</InputLabel>
          <Select
            defaultValue={data?.machineId || ""}
            {...register("machines")}
            error={!!errors.machines}
            label="Machines"
            name="machines"
          >
            {machines.map((machine: { id: string; name: string }) => (
              <MenuItem key={machine.id} value={machine.id}>
                {machine.name}
              </MenuItem>
            ))}
          </Select>
          {errors.machines?.message && (
            <Typography variant="body2" color="error">
              {errors.machines.message.toString()}
            </Typography>
          )}
        </FormControl>
      </Box>
      {state.error && (
        <Typography variant="body2" color="error">
          Something went wrong!
        </Typography>
      )}
      <Button type="submit" variant="contained" color="primary">
        {type === "create" ? "Create" : "Update"}
      </Button>
    </Box>
  );
};

export default MonitoringPointForm;
