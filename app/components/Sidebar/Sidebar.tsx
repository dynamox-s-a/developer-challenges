"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthToken } from "../../../lib/redux/slices/authSlice";

import Link from "next/link";
import { RxDashboard, RxGear, RxPerson } from "react-icons/rx";
import { MdSensors } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { selectAuthToken, selectUserId } from "../../../lib/redux/slices/authSlice";
import { User } from "../../../lib/redux/slices/userSlice";
import API_BASE_URL from "../../api/config";

interface SidebarProps {
  handleComponentChange: (componentName: string) => void;
  setShowDashboard: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({ handleComponentChange, setShowDashboard }: SidebarProps) => {

  const dispatch = useDispatch();
  const authToken = useSelector(selectAuthToken);
  const userId = useSelector(selectUserId);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const [formData, setFormData] = useState<User>({
    id: 0,
    nome: "",
    sobrenome: "",
    código: "",
    setor: "",
    email: "",
    password: "",
    telefone: "",
    foto: "",
  });

  const fetchUserData = async (userId: any) => {
    try {
      if (!authToken) {
        return;
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setFormData(userData);
      } else {
        console.error("Erro ao obter dados do usuário.");
      }
    } catch (error) {
      console.error("Erro ao fazer a solicitação:", error);
    }
  };

  useEffect(() => {
    if (authToken && userId) {
      fetchUserData(userId);
    }
  }, [authToken, userId]);

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
          <img
            src={formData.foto}
            alt={formData.nome}
            className="h-[50px] rounded-full mx-auto "
          />
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
