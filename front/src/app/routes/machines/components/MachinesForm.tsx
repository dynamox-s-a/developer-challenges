"use client";

import FormCard from "@/app/components/FormCard/FormCard";
import FormProvider from "@/app/components/FormProvider/FormProvider";
import Iconify from "@/app/components/Iconify/Iconify";
import MainSelect from "@/app/components/Select/MainSelect";
import MainTextField from "@/app/components/TextField/TextField";
import { yupResolver } from "@hookform/resolvers/yup";
import { Grid, MenuItem, Typography } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import MachineService from "@/app/services/Machine/MachineService";
import Machine from "@/app/types/Machine";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "@/app/redux/store";

export default function MachineForms({ type }: { type: string }) {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("This field is required"),
    type: Yup.string().required("This field is required"),
  });

  const router = useRouter();
  const id = usePathname().split("/").slice(-1)[0];

  const machineData = useSelector((state) => state.machinesSlice.machine);

  let defaultValues = {
    name: "",
    type: "",
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
    getValues,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (type == "update" && machineData) {
      setValue("name", machineData.name);
      setValue("type", machineData.type);
    }
  }, [machineData]);

  const onSubmit = async (data: any) => {
    let machine: Machine = {
      id: Number(id),
      name: data.name,
      type: data.type,
    };
    type == "new" && delete machine.id;
    try {
      let post =
        type == "new"
          ? await MachineService.save(machine)
          : await MachineService.update(Number(id), machine);
      if (post.status == 201 || post.status == 200)
        router.push("/routes/machines");
    } catch (error) {
      console.error("Error in register", error);
    }
  };

  return (
    <FormCard functionConfirm={handleSubmit(onSubmit)} topContent="New Machine">
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
              <Iconify fontSize={62} icon="material-symbols:construction" />
            </Grid>

            <MainTextField
              sx={{ mb: 2 }}
              label={"Name"}
              requerido
              name="name"
            />
            <MainSelect label={"Type"} requerido name="type">
              <MenuItem value="PUMP">
                <Typography>PUMP</Typography>
              </MenuItem>
              <MenuItem value="FAN">
                <Typography>FAN</Typography>
              </MenuItem>
            </MainSelect>
          </Grid>
        </Grid>
      </FormProvider>
    </FormCard>
  );
}
