"use client";

import { useAppDispatch } from "../../features/store";
import { login } from "../../features/authSlice";
import { Button, TextField, Container, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email === "123" && password === "123") {
      dispatch(login());
      router.push("/");
    } else {
      alert("Email ou senha incorretos");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Login
      </Typography>
      <TextField
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Senha"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleLogin}
      >
        Entrar
      </Button>
    </Container>
  );
};

export default LoginPage;
