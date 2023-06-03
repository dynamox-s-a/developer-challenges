import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";

import Sensor from "lib/utils/types/sensor";

import { useAppSelector } from "redux/hooks";
import { Session } from "lib/auth/auth";
import { sensorPostResultMsg as postResultMsg } from "lib/utils/post/post-result";

export async function post(
  sensor: Sensor,
  session: Session | null
): Promise<string> {
  if (!session) {
    return postResultMsg.BAD_CREDENTIALS;
  }

  const createRoute = "/api/sensor/create";
  const response = await fetch(createRoute, {
    body: JSON.stringify({
      name: sensor.name,
      model: sensor.model,
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

  if (postResponse.name != sensor.name || postResponse.model != sensor.model) {
    return postResultMsg.BAD_RESPONSE;
  } else {
    return postResultMsg.SUCCESS;
  }
}

export default function CreateSensor() {
  const session = useAppSelector((state) => state.sessionReducer.session);
  const router = useRouter();

  const [model, setModel] = useState("HF+");
  const [error, setError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [modelError, setModelError] = useState<string | null>(null);
  const [conflictError, setConflictError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!session) {
      router.push("/login");
      return;
    }

    const data = new FormData(event.currentTarget);

    const name = data.get("name")?.toString();

    if (!name) setNameError("faltou inserir o nome do sensor");
    if (!model) setModelError("faltou selecionar o modelo do sensor");

    if (nameError || modelError) return;

    const responseStatus = await post(
      { id: null, name: name || "", model: model || "" },
      session
    );

    if (responseStatus == postResultMsg.DATA_CONFLICT)
      setConflictError(postResultMsg.DATA_CONFLICT);

    if (responseStatus == postResultMsg.SUCCESS) router.push("/");
  };

  useEffect(() => {
    if (nameError || modelError) setError("preencha o formulário corretamente");
    else if (conflictError) setError(conflictError);
    else setError(null);
  });

  const handleSetModel = (e: SelectChangeEvent) => {
    e.preventDefault();
    setModel(e.target.value);
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
          Criar Máquina
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Nome do Sensor"
            name="name"
            autoFocus
            error={!!nameError}
            helperText={nameError}
            onChange={() => {
              setNameError(null);
              setConflictError(null);
            }}
            inputProps={{ "data-testid": "email-input" }}
          />
          <FormControl sx={{ marginTop: 1, width: "100%" }}>
            <InputLabel id="model-label">Modelo</InputLabel>
            <Select
              value={model}
              fullWidth
              labelId="model-label"
              id="model"
              label="Modelo"
              onChange={handleSetModel}
              inputProps={{ "data-testid": "model-input" }}
            >
              <MenuItem value={"HF+"}>HF+</MenuItem>
              <MenuItem value={"TcAg"}>TcAg</MenuItem>
              <MenuItem value={"TcAs"}>TcAs</MenuItem>
            </Select>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            color={!!error ? "error" : "primary"}
            disabled={!!error}
            data-testid="submit-button"
          >
            Criar Sensor
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
