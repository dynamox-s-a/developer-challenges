import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import MachinePage from "./pages/MachinePage";
import { PrivateRoute } from "./routes/PrivateRoute";
import SensorPage from "./pages/MonitoringPoint";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/machines"
          element={
            <PrivateRoute>
              <MachinePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/sensors"
          element={
            <PrivateRoute>
              <SensorPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
