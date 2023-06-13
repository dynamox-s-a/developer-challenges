import { ClipLoader } from "react-spinners";
import React, { useState, useEffect } from "react";
import { setMachines } from "../../store/actions/machineActions";
import { useDispatch } from "react-redux";

export default function MonitoringPointsList() {
  const [monitoringPointsLoading, setMonitoringPointsLoading] = useState(true);
  const dispatch = useDispatch();

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
      dispatch(setMachines(monPointsRes));
    }
  }

  useEffect(() => {
    getMonitoringPoints();
  }, []);
}
