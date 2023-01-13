import { SyntheticEvent, useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectUser, loginAsync } from "./userSlice";
import { useNavigate } from "react-router-dom";

export function UserLogin() {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const submitHandler = (event: SyntheticEvent) => {
    event.preventDefault();
    dispatch(loginAsync({ username, password }));
  };

  useEffect(() => {
    if (user && user.status === "logged-in") navigate("/home");
  }, [user, navigate]);

  return (
    <div>
      <p>status: {user.status}</p>
      <p>idade: {user.data?.age}</p>
      <p>nome: {user.data?.name}</p>
      <p>jwt: {user.data?.jwt}</p>
      <form onSubmit={submitHandler}>
        <label htmlFor="nome">Usuario</label>
        <input
          id="nome"
          type="text"
          name="text"
          onChange={(e) => setUsername(e.target.value)}
        ></input>

        <label htmlFor="password">Senha</label>
        <input
          id="password"
          type="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
        ></input>

        <input type="submit" value="Logar"></input>
      </form>
    </div>
  );
}
