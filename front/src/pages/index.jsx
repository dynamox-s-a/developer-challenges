import React from "react";
import {Route, Routes, Navigate} from "react-router-dom";
import {useSelector} from "react-redux";

import Login from "./Login";
import Products from "./Products";

function PrivateRoute({children}) {
  const {isAuthenticated} = useSelector((state) => state.auth);

  return isAuthenticated ? children : <Navigate to="/" />;
}

export default () => (
  <Routes>
    <Route path="/" element={<Login />} />
    <Route
      path="/products"
      element={
        <PrivateRoute>
          <Products />
        </PrivateRoute>
      }
    />
  </Routes>
);
