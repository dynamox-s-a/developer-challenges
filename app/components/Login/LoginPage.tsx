import { useState } from "react";
import { useDispatch } from "react-redux";
import { setAuthToken } from "../../../lib/redux/slices/authSlice";
import { generateRandomToken } from "../../utils/tokenGenerator";

const LoginPage = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    // Verifique as credenciais do usuário no db.json
    const headers = new Headers();
    headers.append("Cache-Control", "no-cache"); 

    const response = await fetch("http://localhost:3001/users", {
      method: "GET",
      headers,
    });

    const data = await response.json();

    console.log("Dados do servidor:", data);

    const user = data.users.find(
      (user: any) => user.email === email && user.senha === password
    );

    if (user) {
      const token = generateRandomToken(10);
      user.token = token;

      const updateResponse = await fetch(
        `http://localhost:3001/users/${user.token}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      );
  
      if (updateResponse.ok) {
        dispatch(setAuthToken(token));
      } else {
        console.log("Erro ao atualizar o token no servidor");
      }
    } else {
      console.log("Credenciais inválidas");
    }
  };

  return (
    <div className="p-4 w-screen h-screen bg-gray-500 flex">
      <h1>Login</h1>
      <form>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Entrar</button>
      </form>
    </div>
  );
};

export default LoginPage;
