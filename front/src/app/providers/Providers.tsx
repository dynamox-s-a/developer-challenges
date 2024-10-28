"use client";
import React, { ReactNode, lazy } from "react";
import { ToastContainer } from "react-toastify";
import { LayoutProvider } from "./LayoutProvider";

interface Props {
  children: ReactNode;
}

const Providers = ({ children }: Props) => {
  return <LayoutProvider>{children}</LayoutProvider>;
};

export default Providers;
