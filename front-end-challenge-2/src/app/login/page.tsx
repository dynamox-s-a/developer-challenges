"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { login, clearError, checkAuth } from "@/store/slices/authSlice";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated, user } = useAppSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/events");
      }
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(clearError());
    await dispatch(login({ email, password }));
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Sistema de Eventos
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mb: 3 }}
          >
            Faça login para continuar
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              autoComplete="email"
            />
            <TextField
              fullWidth
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : "Entrar"}
            </Button>
          </form>

          <Box sx={{ mt: 3, p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
            <Typography variant="caption" display="block" gutterBottom>
              <strong>Usuários de teste:</strong>
            </Typography>
            <Typography variant="caption" display="block">
              Admin: admin@events.com / admin123
            </Typography>
            <Typography variant="caption" display="block">
              Leitor: reader@events.com / reader123
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
