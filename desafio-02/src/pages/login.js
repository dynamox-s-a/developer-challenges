import { Box, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router'

export default function Login() {

  const router = useRouter();

  const [user, setUser] = useState("");

  const [password, setPassword] = useState("");

  const sendInfo = (e) => {
    e.preventDefault();
    fetch("http://localhost:8080/login", {
      method: 'post',
      body: JSON.stringify({ email: user, password }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        localStorage.setItem("token", JSON.stringify(data.accessToken));
        router.replace("/");
      });
  }

  useEffect(() => {
    if (localStorage.getItem('token')) {
      router.replace("/");
    }
  }, []);

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height='100vh' py={4}>
      <form onSubmit={sendInfo} style={{ display: "flex", alignItems: "center", flexDirection: "column" }} >
        <TextField
          type="email"
          label="Email"
          variant="outlined"
          onChange={(e) => setUser(e.target.value)}
          value={user}
          sx={{ marginBottom: 1 }}
        />
        <TextField
          type="password"
          label="Senha"
          variant="outlined"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          sx={{ marginBottom: 1 }}
        />
        <Button variant="contained" type="submit">Entrar</Button>
      </form>
    </Box>
  );
}
