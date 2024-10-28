"use client";

import React, { useEffect, useState } from "react";
import { Grid, Theme, useMediaQuery } from "@mui/material";
import DataTable from "@/app/components/Grid/MainGrid";
import { dispatch, useSelector } from "@/app/redux/store";
import { getMachineById, getMachines } from "@/app/redux/slices/MachinesSlice";
import { useRouter } from "next/navigation";
import MachineService from "@/app/services/Machine/MachineService";

export default function Machines() {
  const isXs = useMediaQuery((theme: Theme) => theme.breakpoints.down("xs"));
  const isSm = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const isMd = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
  const isLg = useMediaQuery((theme: Theme) => theme.breakpoints.down("lg"));
  const router = useRouter();

  const machines = useSelector((state) => state.machinesSlice.machines);
  let [machineState, setMachine] = useState<any[]>([]);

  useEffect(() => {
    dispatch(getMachines());
  }, []);

  useEffect(() => {
    setMachine(machines);
  }, [machines]);

  const handleRemove = (id: number) => {
    return setMachine((prev: any) => {
      return prev.filter((item: any) => item.id !== id);
    });
  };

  return (
    <>
      <Grid
        display={"flex"}
        alignItems={"center"}
        alignContent={"center"}
        alignSelf={"center"}
        justifyContent={"center"}
        container
        p={{ xs: 12, xl: 0, lg: 6 }}
        xs={12}
      >
        <Grid
          container
          sx={{
            height: "80vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid
            item
            xs={12}
            sm={11.9}
            md={11.8}
            xl={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <DataTable
              entity="Machine"
              removeCheckBox
              deleteFunction={(params) => {
                MachineService.delete(params.id).then((response) => {
                  if (response.status == 200) {
                    handleRemove(params.id);
                  }
                });
              }}
              newFunction={() => {
                router.push("machines/new");
              }}
              editFunction={(params) => {
                router.push("machines/edit/" + params.id);
                if (params && params.id) {
                  dispatch(getMachineById(Number(params.id)));
                }
              }}
              hidedColumns={[
                {
                  xs: ["id"],
                },
              ]}
              header={[
                {
                  field: "id",
                  headerName: "Id",
                  width: isXs
                    ? 120
                    : isSm
                    ? 100
                    : isMd
                    ? 100
                    : isLg
                    ? 100
                    : 350,
                },
                {
                  field: "name",
                  headerName: "Name",
                  width: isXs
                    ? 120
                    : isSm
                    ? 100
                    : isMd
                    ? 200
                    : isLg
                    ? 200
                    : 350,
                },
                {
                  field: "type",
                  headerName: "Type",
                  width: isXs
                    ? 120
                    : isSm
                    ? 200
                    : isMd
                    ? 200
                    : isLg
                    ? 200
                    : 350,
                },
              ]}
              data={machineState}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
