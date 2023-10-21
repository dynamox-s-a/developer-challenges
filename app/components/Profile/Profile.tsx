import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectAuthToken } from "../../../lib/redux/slices/authSlice";
import { User, updateUser } from "../../../lib/redux/slices/userSlice";
import { selectUserId } from "../../../lib/redux/slices/authSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const authToken = useSelector(selectAuthToken);
  const userId = useSelector(selectUserId);

  const [formData, setFormData] = useState<User>({
    id: 0,
    nome: "",
    sobrenome: "",
    código: "",
    setor: "",
    email: "",
    password: "",
    telefone: "",
  });

  const fetchUserData = async (userId: any) => {
    try {
      if (!authToken) {
        return;
      }

      // Faz a requisição para o servidor para obter os dados do usuário com o ID fornecido.
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
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
      fetchUserData(userId); // Busca os dados do usuário com base no token de autenticação e no ID do usuário
    }
  }, [authToken, userId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!authToken) {
        return;
      }

      // Faz a requisição para o servidor para atualizar os dados do usuário.
      const response = await fetch(
        `http://localhost:3001/users/${formData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        dispatch(updateUser(formData));
      } else {
        console.error("Erro ao atualizar dados do usuário.");
      }
    } catch (error) {
      console.error("Erro ao fazer a solicitação:", error);
    }
  };

  return (
    <div className="ml-20 p-4">
      <h2 className="text-xl font-semibold mb-4">Usuário</h2>
      <form>
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
            />
          </div>
          <div>
            <label htmlFor="sobrenome" className="block text-sm font-medium text-gray-700">
              Sobrenome
            </label>
            <input
              type="text"
              id="sobrenome"
              name="sobrenome"
              value={formData.sobrenome}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
            />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="código" className="block text-sm font-medium text-gray-700">
            Código
          </label>
          <input
            type="text"
            id="código"
            name="código"
            value={formData.código}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="setor" className="block text-sm font-medium text-gray-700">
            Setor
          </label>
          <input
            type="text"
            id="setor"
            name="setor"
            value={formData.setor}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
          />
        </div>
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
            />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">
            Telefone
          </label>
          <input
            type="text"
            id="telefone"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
          />
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Atualizar Dados
        </button>
      </form>
    </div>
  );
  
};

export default Profile;
