import { Navigate, Route, Routes } from "react-router-dom";
import { DataPage } from "./features/telemetry/ui/DataPage";

function App() {
  return (
    <Routes>
      <Route path="/data" element={<DataPage />} />
      <Route path="*" element={<Navigate to="/data" replace />} />
    </Routes>
  );
}

export default App;
