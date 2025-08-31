import { Routes, Route, Navigate } from "react-router-dom";
import CreateMachine from "../pages/CreateMachine/CreateMachine";
import { MachineList } from "../pages/ListMachine";
import { MachineDetail } from '../pages/MachineDetails';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CreateMachine />} />
      <Route path="/list" element={<MachineList />} />
      <Route path="/machine/:id" element={<MachineDetail />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
