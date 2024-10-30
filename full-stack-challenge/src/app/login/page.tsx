"use client";

import { useAppDispatch } from "../../features/store";
import { login } from "../../features/authSlice";
import { Button, TextField, Container, Typography, Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email === "admin" && password === "admin") {
      dispatch(login());
      router.push("/");
    } else {
      alert("Email ou senha incorretos");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "darkgrey",
        padding: "20px",
      }}
    >
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
          style={{ backgroundColor: "#696969" }}
        >
          Entrar
        </Button>
      </Container>
    </Box>
  );
};

export default LoginPage;
