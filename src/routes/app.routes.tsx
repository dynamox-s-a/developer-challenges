import { Routes, Route } from "react-router-dom";
import { Home } from "../pages/Home";
import { Data } from "../pages/Data";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/data" element={<Data />} />
    </Routes>
  );
}
