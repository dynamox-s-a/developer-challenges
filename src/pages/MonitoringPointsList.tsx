import { ClipLoader } from "react-spinners";
import { Grid, MenuItem, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import { setMonitoringPoints } from "../../store/actions/machineActions";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { useUser } from "@auth0/nextjs-auth0/client";
import { MonitoringPoint } from "../types/types";

export default function MonitoringPointsList() {
  const { user, error, isLoading } = useUser();
  const [monitoringPointsLoading, setMonitoringPointsLoading] = useState(true);
  const dbUser = useSelector((state: RootState) => state.machines.dbUser);
  const dispatch = useDispatch();
  const [sortBy, setSortBy] = useState("Machine Name");
  const [sortedMonitoringPoints, setSortedMonitoringPoints] = useState<
    MonitoringPoint[]
  >([]);

  useEffect(() => {
    if (!user && !error && !isLoading) {
      window.location.assign(`http://localhost:3000/api/auth/login`);
    }
  }, [user, error, isLoading]);

  const monitoringPoints = useSelector(
    (state: RootState) => state.machines.monitoringPoints
  );

  async function getMonitoringPoints() {
    let res;
    try {
      res = await fetch(`/api/getMonitoringPoints/${dbUser.id}`, {
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

  useEffect(() => {
    sortMonitoringPoints(sortBy);
  }, [sortBy, monitoringPoints]);

  const handleSort = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedSortBy = event.target.value as string;
    setSortBy(selectedSortBy);
    sortMonitoringPoints(selectedSortBy);
  };

  const sortMonitoringPoints = (option: string) => {
    const sortedPoints = [...monitoringPoints];

    sortedPoints.sort((a, b) => {
      if (option === "Machine Name") {
        return a.machineTitle.localeCompare(b.machineTitle);
      } else if (option === "Machine Type") {
        return a.machineType.localeCompare(b.machineType);
      } else if (option === "Monitoring Point Name") {
        return a.title.localeCompare(b.title);
      } else if (option === "Sensor Model") {
        return a.sensor.localeCompare(b.sensor);
      }

      return 0;
    });

    setSortedMonitoringPoints(sortedPoints);
  };

  return (
    <div className="px-8 py-8">
      <a href="/" className="py-4 text-2xl text-blue-500">
        Back
      </a>
      <h1 className="text-2xl py-6">Monitoring Points List</h1>
      <label className="text-sm">Choose a value to sort by:</label>
      <TextField
        select
        onChange={(event) => handleSort(event)}
        variant="outlined"
        margin="dense"
        required
        fullWidth
        value={sortBy}
      >
        <MenuItem value="Machine Name">Machine Name</MenuItem>
        <MenuItem value="Machine Type">Machine Type</MenuItem>
        <MenuItem value="Monitoring Point Name">Monitoring Point Name</MenuItem>
        <MenuItem value="Sensor Model">Sensor Model</MenuItem>
      </TextField>
      {monitoringPointsLoading ? (
        <ClipLoader className="h-10 w-10 mt-6" />
      ) : (
        <Grid container className="py-6">
          {sortedMonitoringPoints?.map(
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
