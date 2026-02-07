import { useState } from "react";
import { Container, TextField, Button, Typography, Box, Alert } from "@mui/material";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import type { AppDispatch } from "../store";
import { api } from "../api";
import { setToken } from "../store/authSlice";

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from ?? "/";

  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError(null);
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { username, password });
      dispatch(setToken(res.data.token));
      navigate(from, { replace: true });
    } catch {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Typography variant="h5" gutterBottom>
        Sign in
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </Button>

        <Typography variant="body2" sx={{ opacity: 0.7 }}>
          Default credentials: admin / admin
        </Typography>
      </Box>
    </Container>
  );
}