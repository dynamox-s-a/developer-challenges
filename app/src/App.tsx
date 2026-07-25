import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardApp } from "./features/dashboard/DashboardApp";

export function App() {
  return (
    <Routes>
      <Route path="/data" element={<DashboardApp />} />
      <Route path="*" element={<Navigate to="/data" replace />} />
    </Routes>
  );
}
