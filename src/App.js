import { Route, BrowserRouter, Routes } from "react-router-dom";
import React from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NewProduct from "./pages/NewProduct";
import { ToastContainer } from "react-toastify";
import ProtectedRouteGuard from "./utils/ProtectRouteGuard";

export default function App() {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <div>
          <Routes>
            <Route path="/" element={<Login />}></Route>
            <Route
              path="/products"
              element={
                <ProtectedRouteGuard>
                  <Dashboard />
                </ProtectedRouteGuard>
              }></Route>
              <Route
              path="/products/new"
              element={
                <ProtectedRouteGuard>
                  <NewProduct />
                </ProtectedRouteGuard>
              }
            ></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}
