"use client";

import { login } from "@/app/services/users";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Typography, Box, Checkbox, FormControlLabel } from "@mui/material";
import Button from "../button/Button";
import Input from "../input/Input";
import { ROLES } from "../../app/constants/roles";

const Form = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const user = await login({ email, password });

      if (user.role === ROLES.ADMIN) {
        router.push("/dashboard");
      } else if (user.role === ROLES.READER) {
        router.push("/events");
      } else {
        setError("Usuário não tem permissão de acesso.");
      }
    } catch (err) {
      if (err) setError("Credenciais inválidas. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) {
    return null;
  }

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

      {error && (
        <Typography color="error" textAlign="center" sx={{ marginTop: 1 }}>
          {error}
        </Typography>
      )}

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

      <Button isSubmitting={isSubmitting} />
    </Box>
  );
};

export default Form;
