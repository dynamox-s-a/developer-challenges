import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Gerenciamento from "../pages/Gerenciamento";
import CadastrarUsuario from "../pages/CadastrarUsuario";

// Componente para rotas protegidas
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" replace />;
};

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/gerenciamento"
          element={
            <PrivateRoute>
              <Gerenciamento />
            </PrivateRoute>
          }
        />
        <Route path="/cadastro" element={<CadastrarUsuario />} />
      </Routes>
    </BrowserRouter>
  );
}
