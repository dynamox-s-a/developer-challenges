import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import MachinePage from "./pages/MachinePage";
import { PrivateRoute } from "./routes/PrivateRoute";
import { PublicRoute } from "./routes/PublicRoute";
import MonitoringPointPage from "./pages/MonitoringPointPage";
import Layout from "./components/Layout";

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
              <Layout>
                <MachinePage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/monitoring-points"
          element={
            <PrivateRoute>
              <Layout>
                <MonitoringPointPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
