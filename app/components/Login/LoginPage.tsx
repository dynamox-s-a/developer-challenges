import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setAuthToken,
  selectAuthToken,
} from "../../../lib/redux/slices/authSlice";
import { updateUser } from "../../../lib/redux/slices/userSlice";
import { generateRandomToken } from "../../utils/tokenGenerator";
import Image from "next/image";

const LoginPage = () => {
  const authToken = useSelector(selectAuthToken);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginResult, setLoginResult] = useState<null | {
    success: boolean;
    message: string;
    user: any;
  }>(null);

  if (authToken) {
    window.location.href = "/";
    return null;
  }

  const handleLogin = async (e: any) => {
    // Verifica as credenciais do usuário no db.json
    e.preventDefault();
    const headers = new Headers();
    headers.append("Cache-Control", "no-cache");

    const response = await fetch("http://localhost:3001/users", {
      method: "GET",
      headers,
    });

    const data = await response.json();

    if (data && data.length > 0) {
      const matchingUser = data.find(
        (user: any) => user.email === email && user.password === password
      );

      if (matchingUser) {
        const token = generateRandomToken(10);
        matchingUser.token = token;

        const updateResponse = await fetch(
          `http://localhost:3001/users/${matchingUser.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(matchingUser),
          }
        );

        if (updateResponse.ok) {
          setLoginResult({
            success: true,
            user: {
              email: matchingUser.email,
              password: matchingUser.password,
            },
            message: "Login bem-sucedido",
          });
          dispatch(updateUser(matchingUser));
          dispatch(setAuthToken({ token, userId: matchingUser.id }));

          console.log("token gravado");
        } else {
          // Erro ao atualizar o token no servidor
          setLoginResult({
            success: false,
            user: null,
            message: "Erro ao atualizar o token no servidor",
          });
          console.log("token não atualizado");
        }
      } else {
        // Credenciais incorretas
        setLoginResult({
          success: false,
          user: null,
          message: "Credenciais incorretas",
        });
        console.log("Credenciais incorretas");
      }
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md p-8 bg-white rounded shadow-lg">
        

        <h1 className="text-2xl font-bold mb-4">DynaPredict Dashboard</h1>
        <div className="flex justify-center mx-auto mb-4">
          <Image
            src="/assets/img/dynapredict.png"
            alt="Logotipo da Empresa"
            width={200} // Defina a largura desejada
            height={50} // Defina a altura desejada
          />
        </div>
        
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">
              Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              placeholder="Senha"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Entrar
          </button>
        </form>
        {loginResult && !loginResult.success && (
          <p className="mt-4 text-red-600 flex justify-center">
            {loginResult.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
