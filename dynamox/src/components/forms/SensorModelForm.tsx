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
import { SensorModelFormValidation } from "@/src/lib/validation";
import { useFormState } from "react-dom";
import {
  createMonitoringPointSensorModel,
  updateMonitoringPointSensorModel,
} from "@/src/lib/actions";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { SensorTypeOptions } from "@/src/constants";

type Inputs = z.infer<typeof SensorModelFormValidation>;

interface SensorModelFormProps {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: { sensors: { id: string; model: string }[] } & {
    monitoringPoints: { id: string; name: string }[];
  };
}

const SensorModelForm = ({
  type,
  data,
  setOpen,
  relatedData = { sensors: [], monitoringPoints: [] },
}: SensorModelFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(SensorModelFormValidation),
  });

  const [state, formAction] = useFormState(
    type === "create"
      ? createMonitoringPointSensorModel
      : updateMonitoringPointSensorModel,
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
        `Machine has been ${type === "create" ? "created" : "updated"}!`
      );
      setOpen(false);
      router.refresh();
    }
  }, [state.success, setOpen, router, type]);

  const { monitoringPoints } = relatedData;

  // const filteredMonitoringPoints = relatedData.monitoringPoints.filter(
  //   (point) => !relatedData.sensors.some((sensor) => sensor.id === point.id)
  // );

  console.log(relatedData.sensors);
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
          <InputLabel>Monitoring Points</InputLabel>
          <Select
            defaultValue={data?.monitoringPointId || ""}
            {...register("monitoringPointId", { required: true })}
            error={!!errors.monitoringPointId}
            label="Monitoring Points"
            name="monitoringPointId"
          >
            {monitoringPoints.map((point: { id: string; name: string }) => (
              <MenuItem key={point.id} value={point.id}>
                {point.name}
              </MenuItem>
            ))}
          </Select>
          {errors.monitoringPointId?.message && (
            <Typography variant="body2" color="error">
              {errors.monitoringPointId.message.toString()}
            </Typography>
          )}
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Sensors</InputLabel>
          <Select
            defaultValue={data?.monitoringPoints || ""}
            {...register("model")}
            error={!!errors.model}
            label="Sensors"
            name="model"
          >
            {SensorTypeOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
          {errors.model?.message && (
            <Typography variant="body2" color="error">
              {errors.model.message.toString()}
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

export default SensorModelForm;
