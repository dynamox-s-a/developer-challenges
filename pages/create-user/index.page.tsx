import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";

import User from "lib/utils/user/types";

import { useAppSelector } from "redux/hooks";
import { Session } from "lib/auth/auth";
import { PostResult } from "lib/utils/post/post-result";

export const postResultMsg: PostResult = {
  SUCCESS: "Usuário criado com sucesso",
  DATA_CONFLICT: "Esse email já está cadastrado",
  BAD_CREDENTIALS: "Você precisa estar logado",
  BAD_RESPONSE: "Servidor respondeu de forma inesperada",
  FETCH_ERROR: "Servidor parece estar offline. Tente mais tarde",
  UNKNOW_ERROR: "Erro desconhecido",
};

export async function post(
  user: User,
  session: Session | null
): Promise<string> {
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

  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordConfirmationError, setPasswordConfirmationError] = useState<
    string | null
  >(null);
  const [conflictError, setConflictError] = useState<string | null>(null);

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

    if (emailError || nameError || passwordError || passwordConfirmationError)
      return;

    const responseStatus = await post(
      { email: email || "", name: name || "", password: password || "" },
      session
    );

    if (responseStatus == postResultMsg.DATA_CONFLICT)
      setConflictError("esse email já está cadastrado");

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
          onChange={() => {
            setEmailError(null);
            setConflictError(null);
          }}
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
          color={!!error ? "error" : "primary"}
          disabled={!!error}
        >
          Sign In
        </Button>
        {error && <Alert severity="error">{error}</Alert>}
      </Box>
    </Box>
  );
}
