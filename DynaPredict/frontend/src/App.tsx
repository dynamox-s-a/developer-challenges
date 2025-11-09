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
          <Route path="/dashboard/*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Routes>
      </Suspense>
    </Router>
  );
}
