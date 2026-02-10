import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import { RequireAuth } from "./components/RequireAuth";
import MachinesPage from "./pages/Machines";
import MonitoringPointsPage from "./pages/MonitoringPoints";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <RequireAuth>
              <Navigate to="/monitoring-points" replace />
            </RequireAuth>
          }
        />

        <Route
          path="/machines"
          element={
            <RequireAuth>
              <MachinesPage />
            </RequireAuth>
          }
        />

        <Route
          path="/monitoring-points"
          element={
            <RequireAuth>
              <MonitoringPointsPage />
            </RequireAuth>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}