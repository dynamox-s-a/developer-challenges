import { Navigate } from "react-router-dom";

import { useSelector } from "react-redux";

import React from "react";

export const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((store) => store.user);
  if (!user) {
    return <Navigate to="/landing" />;
  }
  return children;
};
