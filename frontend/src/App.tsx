import "./App.css";
import DataPage from "./app/pages/DataPage";
import { Navigate, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="*" element={<Navigate to="/data" replace />} />
      <Route path="/" element={<Navigate to="/data" replace />} />
      <Route path="/data" element={<DataPage />} />
    </Routes>
  );
}

export default App;
