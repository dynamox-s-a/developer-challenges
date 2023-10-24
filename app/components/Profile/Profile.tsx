import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectAuthToken } from "../../../lib/redux/slices/authSlice";
import { User, updateUser } from "../../../lib/redux/slices/userSlice";
import { selectUserId } from "../../../lib/redux/slices/authSlice";
import API_BASE_URL from "../../api/config";

const Profile = () => {
  const dispatch = useDispatch();
  const authToken = useSelector(selectAuthToken);
  const userId = useSelector(selectUserId);

  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState(false);

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

      // Faz a requisição para o servidor para obter os dados do usuário com o ID fornecido.
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
      const response = await fetch(`${API_BASE_URL}/users/${formData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        dispatch(updateUser(formData));
        setUpdateSuccess(true);
      } else {
        console.error("Erro ao atualizar dados do usuário.");
        setUpdateError(true);
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

  return (
    <div className="ml-20 p-4">
      <h2 className="text-xl font-semibold mb-4">Usuário</h2>
      <div className="pb-4 border-b grid grid-cols-1 gap-4">
        <h4 className="pt-4 text-lg">Dados do Usuário</h4>
        <div className="grid grid-cols-12 gap-4">

        <div className="grid grid-cols-1 col-span-3 gap-4 flex self-center ">
            <img
              src={formData.foto}
              alt="Foto do Usuário"
              className="w-2/3 rounded-full mx-auto m-4"
            />
          </div>

          <form className="grid grid-cols-12 col-span-9 gap-4">
            <div className="relative col-span-4">
              <input
                type="text"
                id="name"
                name="name"
                readOnly={true}
                value={formData.nome}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=""
              />
              <label
                htmlFor="name"
                className="absolute text-sm text-gray-500 dark:text-gray-400 -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 left-1 peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
              >
                Nome
              </label>
            </div>

            <div className="relative col-span-4">
              <input
                type="text"
                id="lastname"
                name="lastname"
                readOnly={true}
                value={formData.sobrenome}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=""
              />
              <label
                htmlFor="lastname"
                className="absolute text-sm text-gray-500 dark:text-gray-400 -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 left-1 peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
              >
                Sobrenome
              </label>
            </div>

            <div className="relative col-span-4">
              <input
                type="text"
                id="código"
                name="código"
                readOnly={true}
                value={formData.código}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=""
              />
              <label
                htmlFor="código"
                className="absolute text-sm text-gray-500 dark:text-gray-400 -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 left-1 peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
              >
                Código Funcionário
              </label>
            </div>

            <div className="relative col-span-4">
              <input
                type="text"
                id="setor"
                name="setor"
                value={formData.setor}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=""
              />
              <label
                htmlFor="setor"
                className="absolute text-sm text-gray-500 dark:text-gray-400 -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 left-1 peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
              >
                Setor de Trabalho
              </label>
            </div>

            <div className="relative col-span-4">
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=""
              />
              <label
                htmlFor="email"
                className="absolute text-sm text-gray-500 dark:text-gray-400 -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 left-1 peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
              >
                Email
              </label>
            </div>

            <div className="relative col-span-4">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=""
              />
              <label
                htmlFor="password"
                className="absolute text-sm text-gray-500 dark:text-gray-400 -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 left-1 peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
              >
                Senha
              </label>
            </div>

            <div className="relative col-span-4">
              <input
                type="text"
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=""
              />
              <label
                htmlFor="telefone"
                className="absolute text-sm text-gray-500 dark:text-gray-400 -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 left-1 peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
              >
                Telefone
              </label>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="col-span-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Atualizar Dados
            </button>

            {updateSuccess && (
              <div className="text-green-600 col-span-4 self-center justify-self-center">
                Dados atualizados com sucesso!
              </div>
            )}

            {updateError && (
              <div className="text-red-600 col-span-4 self-center justify-self-center">
                Erro ao atualizar os dados do usuário.
              </div>
            )}
          </form>

          
        </div>
      </div>
    </div>
  );
};

export default Profile;
