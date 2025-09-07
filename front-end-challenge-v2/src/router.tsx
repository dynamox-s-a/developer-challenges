import { Routes, Route, Navigate } from "react-router-dom";
import DataPage from "@/ui/pages/DataPage";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/data" replace />} />
      <Route path="/data" element={<DataPage />} />
      <Route
        path="*"
        element={<h2 style={{ margin: 24 }}>404 - Not Found</h2>}
      />
    </Routes>
  );
}
