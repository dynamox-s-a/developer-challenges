import { TextField, Button, Typography, Box } from "@mui/material";

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  error: string | null;
  handleLogin: () => void;
}

const LoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  error,
  handleLogin,
}: LoginFormProps) => {
  return (
    <Box>
      <Typography variant="h3" component="h4" gutterBottom>
        Welcome back!
      </Typography>
      <Typography variant="subtitle1" component="p" gutterBottom>
        Fill in the form below to login.
      </Typography>
      {error && (
        <Typography variant="body2" color="error" gutterBottom>
          {error}
        </Typography>
      )}
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        variant="outlined"
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
        sx={{ mt: 2 }}
      >
        Login
      </Button>
    </Box>
  );
};

export default LoginForm;
