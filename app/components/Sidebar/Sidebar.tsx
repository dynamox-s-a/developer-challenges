"use client";
import React from "react";
import { useDispatch } from "react-redux";
import { setActiveComponent } from "../../../lib/redux/slices/pageSlice";
import { clearAuthToken } from "../../../lib/redux/slices/authSlice";

import Link from "next/link";
import { RxDashboard, RxGear, RxPerson } from "react-icons/rx";
import { MdSensors } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";

interface SidebarProps {
  handleComponentChange: (componentName: string) => void;
  setShowDashboard: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({ handleComponentChange, setShowDashboard }: SidebarProps) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    // Limpa o token de autenticação do Redux
    dispatch(clearAuthToken);
    window.location.href = "/";
  };

  return (
    <div className="flex">
      <div className="fixed w-20 h-screen p-4 bg-white border-r-[1px] flex flex-col justify-between">
        <div className="flex flex-col items-center">
          <Link href="/" onClick={() => handleComponentChange("Dashboard")}>
            <div className="bg-blue-500 text-white p-3 rounded-lg inline-block">
              <RxDashboard size={20} />
            </div>
          </Link>
          <span className="border-b-[2px] border-blue-300 w-full p-2"></span>
          <Link href="/" onClick={() => handleComponentChange("Machines")}>
            <div className="bg-gray-500 hover:bg-blue-500 text-white my-4 p-3 rounded-lg inline-block">
              <RxGear size={20} />
            </div>
          </Link>
          <Link href="/" onClick={() => handleComponentChange("Sensors")}>
            <div className="bg-gray-500 hover:bg-blue-500 text-white my-4 p-3 rounded-lg inline-block">
              <MdSensors size={20} />
            </div>
          </Link>
          <Link href="/" onClick={() => handleComponentChange("Profile")}>
            <div className="bg-gray-500 hover:bg-blue-500 text-white my-4 p-3 rounded-lg inline-block">
              <RxPerson size={20} />
            </div>
          </Link>
        </div>
        <div>
          <Link href="/" onClick={handleLogout}>
            <div className="bg-gray-500 hover:bg-blue-500 text-white my-4 p-3 rounded-lg inline-block">
              <FiLogOut size={20} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
