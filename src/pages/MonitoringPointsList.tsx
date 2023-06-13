import { ClipLoader } from "react-spinners";
import { Button, Grid, MenuItem, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import { setMonitoringPoints } from "../../store/actions/machineActions";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { MonitoringPoint } from "../types/types";

export default function MonitoringPointsList() {
  const [monitoringPointsLoading, setMonitoringPointsLoading] = useState(true);
  const dispatch = useDispatch();
  const monitoringPoints = useSelector(
    (state: RootState) => state.machines.monitoringPoints
  );

  console.log(monitoringPoints);

  async function getMonitoringPoints() {
    let res;
    try {
      res = await fetch(`/api/getMonitoringPoints/1`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error(error);
    } finally {
      const monPointsRes = await res?.json();
      setMonitoringPointsLoading(false);
      dispatch(setMonitoringPoints(monPointsRes));
    }
  }

  useEffect(() => {
    getMonitoringPoints();
  }, []);

  return (
    <div className="px-8 py-8">
      <a href="/" className="py-4 text-2xl text-blue-500">
        Back
      </a>
      <h1 className="text-2xl py-6">Monitoring Points List</h1>
      {monitoringPointsLoading ? (
        <ClipLoader className="h-10 w-10" />
      ) : (
        <Grid container className="py-6">
          {monitoringPoints.map(
            (monitoringPoint: MonitoringPoint, index: number) => (
              <Grid item xs={12} key={index} className="px-8">
                <div className="flex justify-evenly items-center bg-gray-200 px-8 py-6 border rounded border-gray-900 -mt-2">
                  <div className="flex justify-center items-center flex-col w-8/12">
                    <label className="text-xs underline">Name</label>
                    <h2 className="text-xl hover:underline cursor-pointer">
                      {monitoringPoint.title}
                    </h2>
                  </div>
                  <div className="flex justify-center items-center flex-col w-8/12">
                    <label className="text-xs underline">Sensor Model</label>
                    <h2 className="text-xl hover:underline cursor-pointer">
                      {monitoringPoint.sensor}
                    </h2>
                  </div>
                  <div className="flex justify-center items-center flex-col w-8/12">
                    <label className="text-xs underline">Machine Title</label>
                    <h2 className="text-xl hover:underline cursor-pointer">
                      {monitoringPoint.machineTitle}
                    </h2>
                  </div>
                  <div className="flex justify-center items-center flex-col w-8/12">
                    <label className="text-xs underline">Machine Type</label>
                    <h2 className="text-xl hover:underline cursor-pointer">
                      {monitoringPoint.machineType}
                    </h2>
                  </div>
                </div>
              </Grid>
            )
          )}
        </Grid>
      )}
    </div>
  );
}
