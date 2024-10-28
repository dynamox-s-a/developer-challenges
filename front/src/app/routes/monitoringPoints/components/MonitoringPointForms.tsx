"use client";

import FormCard from "@/app/components/FormCard/FormCard";
import FormProvider from "@/app/components/FormProvider/FormProvider";
import Iconify from "@/app/components/Iconify/Iconify";
import MainSelect from "@/app/components/Select/MainSelect";
import MainTextField from "@/app/components/TextField/TextField";
import { yupResolver } from "@hookform/resolvers/yup";
import { Grid, ListItemText, MenuItem, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "@/app/redux/store";
import MonitoringPointsService from "@/app/services/MonitoringPoints/MonitoringPointsService";
import MonitoringPoints from "@/app/types/MonitoringPoints";

export default function MonitoringPointForms({ type }: { type: string }) {
  const [typeOfMachine, setType] = useState<string>("");

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("This field is required"),
    sensorId: Yup.string()
      .required("This field is required")
      .test(
        "valid type",
        "This sensor is not valid for the machine type",
        (data) => {
          if (Number(data) != 3) return typeOfMachine != "PUMP";
          else return true;
        }
      ),
    machineId: Yup.string().required("This field is required"),
  });

  const router = useRouter();
  const id = usePathname().split("/").slice(-1)[0];

  const machineData = useSelector((state) => state.machinesSlice.machines);
  const monitoringPointData = useSelector(
    (state) => state.monitorinPointsSlice.monitoringPoint
  );

  let defaultValues = {
    name: "",
    machineId: 0,
    sensorId: 0,
  };
  const methods = useForm({
    resolver: yupResolver(validationSchema) as any,
    mode: "onBlur",
    defaultValues: defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (type == "update" && monitoringPointData) {
      setValue("name", monitoringPointData.name);
      setValue("machineId", monitoringPointData.machine.id || 0);
      setValue("sensorId", monitoringPointData.sensor.id);
      setType(monitoringPointData.machine.type);
    }
  }, [machineData]);

  const onSubmit = async (data: any) => {
    let monitoringPoint: MonitoringPoints = {
      id: Number(id),
      name: data.name,
      sensorId: Number(data.sensorId),
      machineId: Number(data.machineId),
    };
    type == "new" && delete monitoringPoint.id;
    try {
      let post =
        type == "new"
          ? await MonitoringPointsService.save(monitoringPoint)
          : await MonitoringPointsService.update(Number(id), monitoringPoint);
      if (post.status == 201 || post.status == 200)
        router.push("/routes/monitoringPoints");
    } catch (error) {
      console.error("Error in register", error);
    }
  };

  const sensors = [
    { id: 1, name: "TcAg" },
    { id: 2, name: "TcAs" },
    { id: 3, name: "HF+" },
  ];

  return (
    <FormCard
      functionConfirm={handleSubmit(onSubmit)}
      topContent="New Montoring Point"
    >
      <FormProvider methods={methods}>
        <Grid
          xs={12}
          container
          height={{ xl: "50dvh", md: "50dvh" }}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Grid spacing={2} mb={2} item xs={6}>
            <Grid
              item
              xs={12}
              mb={2}
              container
              justifyContent="center"
              alignItems="center"
            >
              <Iconify fontSize={62} icon="material-symbols:monitoring" />
            </Grid>

            <MainTextField
              sx={{ mb: 2 }}
              label={"Name of Monitoring Point"}
              requerido
              name="name"
            />
            <MainSelect
              sx={{ mb: 2 }}
              label={"Sensor Model"}
              requerido
              name="sensorId"
            >
              {sensors.map((i: { name: string; id: number }) => {
                if (typeOfMachine == "") {
                  return (
                    <MenuItem key={i.name} value={i.id}>
                      {i.name}
                    </MenuItem>
                  );
                } else if (typeOfMachine == "PUMP") {
                  if (i.name == "HF+") {
                    return (
                      <MenuItem key={i.name} value={i.id}>
                        {i.name}
                      </MenuItem>
                    );
                  }
                } else {
                  return (
                    <MenuItem key={i.name} value={i.id}>
                      {i.name}
                    </MenuItem>
                  );
                }
              })}
            </MainSelect>
            <MainSelect label={"Machine"} requerido name="machineId">
              {machineData.map((machine) => {
                return (
                  <MenuItem
                    onClick={(e: any) => {
                      setType(machine.type);
                    }}
                    value={machine.id}
                    key={"Name" + machine.id}
                  >
                    <ListItemText
                      primary={`Name: ${machine.name}`}
                      secondary={`Type: ${machine.type}`}
                    />
                  </MenuItem>
                );
              })}
            </MainSelect>
          </Grid>
        </Grid>
      </FormProvider>
    </FormCard>
  );
}
