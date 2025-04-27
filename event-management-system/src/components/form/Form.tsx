"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Typography, Box, Checkbox, FormControlLabel } from "@mui/material";
import Button from "../button/Button";
import Input from "../input/Input";

const Form = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await axios.post("/api/login", { email, password });

      const { user } = response.data;

      if (user.role === "admin") {
        router.push("/dashboard");
      } else if (user.role === "reader") {
        router.push("/events");
      } else {
        setError("Função de usuário desconhecida.");
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 401) {
          setError("Credenciais inválidas. Tente novamente.");
        } else {
          setError("Erro ao tentar fazer login. Tente novamente.");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: 400,
        mx: "auto",
      }}
    >
      <Input
        id="email"
        label="Email"
        type="email"
        placeholder="Digite seu email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        id="password"
        label="Senha"
        type={showPassword ? "text" : "password"}
        placeholder="Digite sua senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
            sx={{
              color: "#692746",
              "&.Mui-checked": {
                color: "#692746",
              },
            }}
          />
        }
        label="Visualizar senha"
        sx={{
          color: "white",
          textAlign: "left",
          width: "100%",
          "& .MuiFormControlLabel-label": {
            fontSize: "0.8rem",
          },
        }}
      />

      {error && (
        <Typography color="error" textAlign="center">
          {error}
        </Typography>
      )}

      <Button isSubmitting={isSubmitting} />
    </Box>
  );
};

export default Form;
