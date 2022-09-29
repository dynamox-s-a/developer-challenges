import React from "react";
import { Route, Routes } from "react-router-dom";
import MainPage from "../pages/MainPage";

export default function NavigationRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
    </Routes>
  );
}
