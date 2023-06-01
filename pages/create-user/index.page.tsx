import React, { useState } from "react";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";

export default function CreateUser() {
  const [emailError, setEmailError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordConfirmationError, setPasswordConfirmationError] = useState<
    string | null
  >(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const email = data.get("email")?.toString();
    const name = data.get("name")?.toString();
    const password = data.get("password")?.toString();
    const passwordConfirmation = data.get("passwordConfirmation")?.toString();

    if (!email) setEmailError("faltou inserir o email");
    if (!name) setNameError("faltou inserir o nome do usuário");
    if (!password) setPasswordError("faltou inserir o password");
    if (!passwordConfirmation)
      setPasswordConfirmationError("faltou inserir a confirmação do password");

    if (password != passwordConfirmation) {
      setPasswordError("o password precisa ser igual a confirmação");
      setPasswordConfirmationError(
        "a confirmação precisa ser igual ao password"
      );
    }

    if (emailError || nameError || passwordError || passwordConfirmationError)
      return;
  };

  return (
    <Box
      sx={{
        marginTop: 16,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        paddingX: "30%",
      }}
    >
      <Typography component="h1" variant="h5">
        Criar Usuário
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          error={!!emailError}
          helperText={emailError}
          onChange={() => setEmailError(null)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="Nome do Usuário"
          name="name"
          autoFocus
          error={!!nameError}
          helperText={nameError}
          onChange={() => setNameError(null)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          error={!!passwordError}
          helperText={passwordError}
          onChange={() => setPasswordError(null)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="passwordConfirmation"
          label="Repita o Password"
          type="password"
          id="passwordConfirmation"
          autoComplete="current-password"
          error={!!passwordConfirmationError}
          helperText={passwordConfirmationError}
          onChange={() => setPasswordConfirmationError(null)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign In
        </Button>
      </Box>
    </Box>
  );
}
