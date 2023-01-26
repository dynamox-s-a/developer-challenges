// import {
//   BrowserRouter,
//   Routes,
//   Route,
//   Navigate,
//   Switch,
// } from "react-router-dom";

import { Route, BrowserRouter, Routes } from "react-router-dom";
import React from "react";
import Login from "./pages/Login";

export default function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Login />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}
