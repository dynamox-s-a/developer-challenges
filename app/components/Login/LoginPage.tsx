import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthToken, selectAuthToken } from "../../../lib/redux/slices/authSlice";
import { updateUser } from "../../../lib/redux/slices/userSlice";
import { generateRandomToken } from "../../utils/tokenGenerator";

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
    <div className="p-4 w-screen h-screen bg-gray-500 flex">
      <h1>Login</h1>
      <form method="POST" onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          name="passwrd"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Entrar</button>
      </form>
      {loginResult && !loginResult.success && <p>{loginResult.message}</p>}
    </div>
  );
};

export default LoginPage;
