import { Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import LoginPage from "./pages/Login";
import CreateAccountPage from "./pages/CreateAccount";
import { ProtectedRoute } from "./components/auth/protected-route";
import Dashboard from "./pages/dashboard";
import { CreateMachine } from "./components/dashboard/create-machine";
import { MachineManagement } from "./components/dashboard/manage-machine";
import { EditMachine } from "./components/dashboard/edit-machine";
import { CreateSensor } from "./components/dashboard/create-sensor";
import { SensorManagement } from "./components/dashboard/manage-sensor";
import { CreateMonitoringPoint } from "./components/dashboard/create-monitoring-point";
import { MonitoringPointManagement } from "./components/dashboard/manage-monitoring-point";
import RemoveMonitoringPoint from "./components/dashboard/remove-monitoring-point";

export default function App() {
  return (
    <Router>
      <Suspense fallback={<div></div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<CreateAccountPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/machines/create"
            element={
              <ProtectedRoute>
                <CreateMachine />
              </ProtectedRoute>
            }
          />
          <Route
            path="/machines/manage"
            element={
              <ProtectedRoute>
                <MachineManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/machines/:id/edit"
            element={
              <ProtectedRoute>
                <EditMachine />
              </ProtectedRoute>
            }
          />

          <Route
            path="/monitoring-points/create"
            element={
              <ProtectedRoute>
                <CreateMonitoringPoint />
              </ProtectedRoute>
            }
          />
          <Route
            path="/monitoring-points/manage"
            element={
              <ProtectedRoute>
                <MonitoringPointManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/monitoring-points/remove"
            element={
              <ProtectedRoute>
                <RemoveMonitoringPoint />
              </ProtectedRoute>
            }
          />

          <Route
            path="/sensors"
            element={<Navigate to="/sensors/manage" replace />}
          />
          <Route
            path="/sensors/create"
            element={
              <ProtectedRoute>
                <CreateSensor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sensors/manage"
            element={
              <ProtectedRoute>
                <SensorManagement />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
}
