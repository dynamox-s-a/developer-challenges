import MonitoringPointForm from "@/features/machines/components/monitoringPointForm";
import MonitoringPointsList from "@/features/machines/components/monitoringPointList";
import React from "react";

const MonitoringPointsPage = () => {
  return (
    <div>
      <h1>Monitoring Points</h1>
      <MonitoringPointForm />
      <MonitoringPointsList />
    </div>
  );
};

export default MonitoringPointsPage;
