"use client";

import {
  TextField,
  Paper,
  Typography,
  Box,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import type { LoginFormCredentials, LoginFormProps } from "@/types";
import LoginButton from "../ui/actions/LoginButton";

export default function LoginForm({
  onSubmit,
  loading = false,
  title = "Login",
  className,
}: LoginFormProps) {
  const [formData, setFormData] = useState<LoginFormCredentials>({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: LoginFormCredentials) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Paper elevation={3} className={className} sx={{ p: 3 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ textAlign: "center", mb: 3 }}
      >
        {title}
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Usuário"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleInputChange}
          variant="outlined"
          required
          margin="normal"
          disabled={loading}
        />

        <TextField
          fullWidth
          label="Senha"
          name="password"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={handleInputChange}
          variant="outlined"
          required
          margin="normal"
          disabled={loading}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={togglePasswordVisibility}
                    edge="end"
                    disabled={loading}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <LoginButton loading={loading} />
      </Box>
    </Paper>
  );
}
