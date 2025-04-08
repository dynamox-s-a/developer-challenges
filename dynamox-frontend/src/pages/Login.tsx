import { useState, useEffect } from "react";
import { Container, Box, TextField, Button, Typography, Paper } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { login } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const auth = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await dispatch(login({ email, password }));

    if (login.fulfilled.match(result)) {
      navigate("/machines");
    }

    if (login.rejected.match(result)) {
      console.error("Login falhou:", result);
    }
  };

  useEffect(() => {
    if (auth.token) {
      navigate("/machines");
    }
  }, [auth.token, navigate]);

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, mt: 8 }}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Senha"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {auth.status === "failed" && (
            <Typography color="error" variant="body2">
              {auth.error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            disabled={auth.status === "loading"}
          >
            {auth.status === "loading" ? "Entrando..." : "Entrar"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
