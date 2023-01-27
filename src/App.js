import { Route, BrowserRouter, Routes } from "react-router-dom";
import React from "react";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";

export default function App() {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <div>
          <Routes>
            <Route path="/" element={<Login />}></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}