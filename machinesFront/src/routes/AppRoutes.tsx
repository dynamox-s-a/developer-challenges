import { Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home";
import { Machine } from "../pages/Machine";
import {Sensor} from "../pages/Sensor";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/machine" element={<Machine />} />
      <Route path="/sensor" element={<Sensor />} />
    </Routes>
  );
}
