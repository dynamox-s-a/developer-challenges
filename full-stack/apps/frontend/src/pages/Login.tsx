import { useMemo, useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  LinearProgress,
  Divider,
  Chip,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DataUsageIcon from "@mui/icons-material/DataUsage";

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
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    return !!username.trim() && !!password.trim() && !loading;
  }, [username, password, loading]);

  async function handleSubmit() {
    if (!canSubmit) return;
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
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        bgcolor: "background.default",
        py: 6,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          variant="outlined"
          sx={{
            overflow: "hidden",
            borderRadius: 3,
          }}
        >
          {/* Header */}
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
              <DataUsageIcon sx={{ opacity: 0.9 }} />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Monitoring Console
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.75 }}>
              Sign in to manage machines and monitoring points.
            </Typography>
          </Box>

          {loading && <LinearProgress />}

          <Divider />

          {/* Form */}
          <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((s) => !s)}
                      edge="end"
                      disabled={loading}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <VisibilityOffIcon fontSize="small" />
                      ) : (
                        <VisibilityIcon fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={!canSubmit}
              sx={{ mt: 0.5 }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                Default credentials:
              </Typography>
              <Chip size="small" variant="outlined" label="admin / admin" />
            </Box>

            <Typography variant="caption" sx={{ opacity: 0.6 }}>
              You’ll be redirected to: <Box component="span" sx={{ fontFamily: "monospace" }}>{from}</Box>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}