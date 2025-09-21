"use client";

import styles from "./page.module.css";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff, Login } from "@mui/icons-material";
import { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt:", formData);
    // Aqui você adicionaria a lógica de autenticação
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.container}>
          <section className={styles.section}>
            <div className={styles.loginContainer}>
              <Paper elevation={3} className={styles.loginForm}>
                <Typography
                  variant="h4"
                  component="h1"
                  className={styles.loginTitle}
                >
                  Event Management System
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
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={togglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={<Login />}
                    className={styles.loginButton}
                  >
                    Entrar
                  </Button>
                </Box>
              </Paper>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
