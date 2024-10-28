"use client";

import React, { useEffect, useState } from "react";
import { Grid, Theme, useMediaQuery } from "@mui/material";
import DataTable from "@/app/components/Grid/MainGrid";
import { dispatch, useSelector } from "@/app/redux/store";
import { useRouter } from "next/navigation";
import {
  getMonitoringPointById,
  getMonitoringPoints,
} from "@/app/redux/slices/MonitoringPointsSlice";
import MonitoringPointsService from "@/app/services/MonitoringPoints/MonitoringPointsService";
import { getMachines } from "@/app/redux/slices/MachinesSlice";

export default function MonitoringPoints() {
  const isXs = useMediaQuery((theme: Theme) => theme.breakpoints.down("xs"));
  const isSm = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const isMd = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
  const isLg = useMediaQuery((theme: Theme) => theme.breakpoints.down("lg"));
  const router = useRouter();

  const monitoringPoints = useSelector(
    (state) => state.monitorinPointsSlice.monitoringPoints
  );
  let [monitoringPointsState, setMonitoringPointsState] = useState<any[]>([]);

  useEffect(() => {
    dispatch(getMonitoringPoints());
  }, []);

  useEffect(() => {
    setMonitoringPointsState(monitoringPoints);
  }, [monitoringPoints]);

  const handleRemove = (id: number) => {
    return setMonitoringPointsState((prev: any) => {
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
              entity="Monitoring Points"
              removeCheckBox
              deleteFunction={(params) => {
                MonitoringPointsService.delete(params.id);
                handleRemove(params.id);
              }}
              newFunction={() => {
                router.push("monitoringPoints/new");
                dispatch(getMachines());
              }}
              editFunction={(params) => {
                router.push("monitoringPoints/edit/" + params.id);
                if (params && params.id != undefined) {
                  dispatch(getMachines());
                  dispatch(
                    getMonitoringPointById(
                      Number(params.id == undefined ? 0 : params.id)
                    )
                  );
                }
              }}
              hidedColumns={[]}
              header={[
                {
                  field: "name",
                  headerName: "Monitoring Point Name",
                  width: isXs
                    ? 200
                    : isSm
                    ? 150
                    : isMd
                    ? 150
                    : isLg
                    ? 100
                    : 350,
                },
                {
                  field: "machineType",
                  headerName: "Machine Type",
                  width: isXs
                    ? 200
                    : isSm
                    ? 100
                    : isMd
                    ? 165
                    : isLg
                    ? 150
                    : 350,
                },
                {
                  field: "machineName",
                  headerName: "Machine Name",
                  width: isXs
                    ? 200
                    : isSm
                    ? 200
                    : isMd
                    ? 180
                    : isLg
                    ? 150
                    : 350,
                },
                {
                  field: "sensorModel",
                  headerName: "Sensor Model",
                  width: isXs
                    ? 200
                    : isSm
                    ? 200
                    : isMd
                    ? 100
                    : isLg
                    ? 100
                    : 300,
                },
              ]}
              data={monitoringPointsState}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
