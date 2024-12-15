import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";

interface SignInFormProps {
  handleLogin: (email: string, password: string) => void;
  error: string | null;
}

const SignInForm: React.FC<SignInFormProps> = ({ handleLogin, error }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const onSubmit = () => handleLogin(email, password);

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="h4" component="h4" fontWeight="bold">
        Sign In
      </Typography>
      <TextField
        label="Email"
        variant="outlined"
        placeholder="user@example.com"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}
      <Button variant="contained" onClick={onSubmit}>
        Sign In
      </Button>
    </Box>
  );
};

export default SignInForm;
