import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import MachinePage from "./pages/MachinePage";
import { PrivateRoute } from "./routes/PrivateRoute";
import { PublicRoute } from "./routes/PublicRoute";
import MonitoringPointPage from "./pages/MonitoringPointPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/machines"
          element={
            <PrivateRoute>
              <MachinePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/monitoring-points"
          element={
            <PrivateRoute>
              <MonitoringPointPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
