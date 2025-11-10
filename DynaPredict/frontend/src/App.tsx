import { Suspense, lazy } from "react";
// No hooks used here; pages handle auth checks themselves.
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
// Route-level code-splitting: defer page code until route is visited.
// const LoginPage = lazy(() => import("./pages/Login"));
// const CreateAccountPage = lazy(() => import("./pages/CreateAccount"));
// const Dashboard = lazy(() => import("./pages/dashboard"));

// Keep PrivateRoute inline in files that need it to avoid unused symbol lint.

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

          {/* Machine management routes */}
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

          {/* Monitoring / sensors / settings placeholders */}
          <Route
            path="/monitoring-points/create"
            element={
              <ProtectedRoute>
                <div style={{ padding: 24 }}>
                  Ponto de Monitoramento - Em desenvolvimento
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/sensors"
            element={
              <ProtectedRoute>
                <div style={{ padding: 24 }}>Sensores - Em desenvolvimento</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <div style={{ padding: 24 }}>
                  Configurações - Em desenvolvimento
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
}
