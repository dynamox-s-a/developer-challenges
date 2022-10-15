import React, { useState } from "react";
import { BigSidebar, SmallSidebar, Navbar } from "../../../components";
import { Outlet } from "react-router-dom";
import { Dashboard, DashboardPage, WorkSpace } from "./styles";

export const Layout = () => {
  return (
    <Dashboard>
      <SmallSidebar />
      <Navbar />
      <WorkSpace>
        <BigSidebar />
        <DashboardPage>
          <Outlet />
        </DashboardPage>
      </WorkSpace>
    </Dashboard>
  );
};
