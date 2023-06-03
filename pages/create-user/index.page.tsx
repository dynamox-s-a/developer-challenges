import React, { useEffect } from "react";
import { useRouter } from "next/router";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";

import User from "lib/utils/types/user";

import { useAppSelector } from "redux/hooks";
import { Session } from "lib/auth/auth";
import { userPostResultMsg as postResultMsg } from "lib/utils/post/post-result";

async function post(user: User, session: Session | null): Promise<string> {
  if (!session) {
    return postResultMsg.BAD_CREDENTIALS;
  }

  const createUserRoute = "/api/user/create";
  const response = await fetch(createUserRoute, {
    body: JSON.stringify({
      email: user.email,
      name: user.name,
      password: user.password,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + session.token,
    },
    method: "POST",
  }).catch(() => null);

  if (!response) {
    return postResultMsg.FETCH_ERROR;
  } else if (response.status === 409) {
    return postResultMsg.DATA_CONFLICT;
  } else if (response.status === 401) {
    return postResultMsg.BAD_CREDENTIALS;
  } else if (response.status !== 200) {
    return postResultMsg.UNKNOW_ERROR;
  }

  const postResponse = await response.json().catch(() => null);
  if (
    postResponse.name != user.name ||
    postResponse.email != user.email ||
    postResponse.password != user.password
  ) {
    return postResultMsg.BAD_RESPONSE;
  } else {
    return postResultMsg.SUCCESS;
  }
}

export default function CreateUser() {
  const session = useAppSelector((state) => state.sessionReducer.session);
  const router = useRouter();

  const [error, setError] = React.useState<string | null>(null);
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [nameError, setNameError] = React.useState<string | null>(null);
  const [passwordError, setPasswordError] = React.useState<string | null>(null);
  const [passwordConfirmationError, setPasswordConfirmationError] =
    React.useState<string | null>(null);
  const [conflictError, setConflictError] = React.useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session) {
      router.push("/login");
      return;
    }

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

    if (
      !email ||
      !name ||
      !password ||
      !passwordConfirmation ||
      password != passwordConfirmation
    )
      return;

    const responseStatus = await post(
      {
        id: null,
        email: email || "",
        name: name || "",
        password: password || "",
      },
      session
    );

    if (responseStatus == postResultMsg.DATA_CONFLICT)
      setConflictError(postResultMsg.DATA_CONFLICT);

    if (responseStatus == postResultMsg.SUCCESS) router.push("/");
  };

  useEffect(() => {
    if (emailError || nameError || passwordError || passwordConfirmationError)
      setError("preencha o formulário corretamente");
    else if (conflictError) setError(conflictError);
    else setError(null);
  });

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
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Criar Usuário
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 1 }}
          data-testid="form"
        >
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
            onChange={() => {
              setEmailError(null);
              setConflictError(null);
            }}
            inputProps={{ "data-testid": "email-input" }}
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
            inputProps={{ "data-testid": "name-input" }}
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
            inputProps={{ "data-testid": "password-input" }}
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
            inputProps={{ "data-testid": "password-confirmation-input" }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            color={!!error ? "error" : "primary"}
            disabled={!!error}
            data-testid="submit-button"
          >
            Sign In
          </Button>
          {error && (
            <Alert severity="error" data-testid="alert-error">
              {error}
            </Alert>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
