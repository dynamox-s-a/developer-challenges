import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { selectAuthToken } from "../../../lib/redux/slices/authSlice";
import { User, updateUser } from "../../../lib/redux/slices/userSlice";
import { selectUserId } from "../../../lib/redux/slices/authSlice";
import API_BASE_URL from "../../api/config";

const Header = () => {
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedDate = currentDateTime.toLocaleDateString("pt-BR");
  const formattedTime = currentDateTime.toLocaleTimeString("pt-BR");

  return (
    <div className="flex justify-between px-4 pt-4 ml-20 w-100">
      <h1 className="text-xl font-semibold mb-4">Dashboard DynaPredict</h1>

      <div className="flex flex-column">
        <h4 className="text-base font-semibold mb-4 col-span-1">
          {`${formData.nome} ${formData.sobrenome}`} |{" "}
          {`${formattedDate} ${formattedTime}`}
        </h4>
      </div>
    </div>
  );
};

export default Header;
