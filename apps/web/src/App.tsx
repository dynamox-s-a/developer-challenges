import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "./features/auth/LoginPage";
import { ProtectedRoute } from "./features/auth/ProtectedRoute";
import { MachinesPage } from "./features/machines/MachinesPage";
import { MonitoringPointsPage } from "./features/monitoring/MonitoringPointsPage";
import { TimeSeriesPage } from "./features/time-series/TimeSeriesPage";
import { AppShell } from "./layout/AppShell";

export function App() {
  return (
    <Routes>
      <Route element={<LoginPage />} path="/login" />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route element={<Navigate replace to="/machines" />} index />
          <Route element={<MachinesPage />} path="machines" />
          <Route element={<MonitoringPointsPage />} path="monitoring-points" />
          <Route element={<TimeSeriesPage />} path="time-series" />
        </Route>
      </Route>
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  );
}
