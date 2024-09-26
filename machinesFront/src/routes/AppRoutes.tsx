import { Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home";
import { Machine } from "../pages/Machine";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/machine" element={<Machine />} />
    </Routes>
  );
}
