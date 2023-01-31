import { Route, BrowserRouter, Routes } from 'react-router-dom';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NewProduct from './pages/NewProduct';
import EditProduct from './pages/EditProduct';
import ProtectedRouteGuard from './utils/protectRouteGuard';

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
              }></Route>
            <Route
              path="/products/:id/edit"
              element={
                <ProtectedRouteGuard>
                  <EditProduct />
                </ProtectedRouteGuard>
              }></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}
