import React, { useEffect } from "react";
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

import MonitoringPoint from "lib/utils/types/monitoring-point";
import Sensor from "lib/utils/types/sensor";
import Machine from "lib/utils/types/machine";

import { useAppSelector } from "redux/hooks";
import { Session } from "lib/auth/auth";
import { monitoringPointPostResultMsg as postResultMsg } from "lib/utils/post/post-result";

export async function post(
  monitoringPoint: MonitoringPoint,
  session: Session | null
): Promise<string> {
  if (!session) {
    return postResultMsg.BAD_CREDENTIALS;
  }

  const createRoute = "/api/monitoring-point/create";
  const response = await fetch(createRoute, {
    body: JSON.stringify({
      name: monitoringPoint.name,
      sensorId: monitoringPoint.sensorId,
      machineId: monitoringPoint.machineId,
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
    postResponse.name != monitoringPoint.name ||
    postResponse.sensorId != monitoringPoint.sensorId ||
    postResponse.machineId != monitoringPoint.machineId
  ) {
    return postResultMsg.BAD_RESPONSE;
  } else {
    return postResultMsg.SUCCESS;
  }
}

export async function getAll(
  readRoute: string,
  session: Session | null
): Promise<Sensor[] | Machine[] | string> {
  if (!session) {
    return postResultMsg.BAD_CREDENTIALS;
  }

  const response = await fetch(readRoute, {
    headers: {
      Authorization: "Bearer " + session.token,
    },
    method: "GET",
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
  if (!Array.isArray(postResponse)) {
    return postResultMsg.BAD_RESPONSE;
  } else {
    return postResponse;
  }
}

export default function CreateMachine() {
  const session = useAppSelector((state) => state.sessionReducer.session);
  const router = useRouter();

  const [error, setError] = React.useState<string | null>(null);
  const [nameError, setNameError] = React.useState<string | null>(null);
  const [sensorIdError, setSensorIdError] = React.useState<string | null>(null);
  const [machineIdError, setMachineIdError] = React.useState<string | null>(
    null
  );
  const [conflictNameError, setConflictNameError] = React.useState<
    string | null
  >(null);

  const [sensor, setSensor] = React.useState<Sensor | null>(null);
  const [machine, setMachine] = React.useState<Machine | null>(null);

  const [sensorId, setSensorId] = React.useState<string>("");
  const [machineId, setMachineId] = React.useState<string>("");

  const [listsIsReady, setListsIsReady] = React.useState(false);
  const [sensorList, setSensorList] = React.useState<Sensor[]>([]);
  const [machineList, setMachineList] = React.useState<Machine[]>([]);
  const [sensorListError, setSensorListError] = React.useState<string | null>(
    null
  );
  const [machineListError, setMachineListError] = React.useState<string | null>(
    null
  );

  const [conflictSensorModelError, setConflictSensorModelError] =
    React.useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!session) {
      router.push("/login");
      return;
    }

    const data = new FormData(event.currentTarget);

    const name = data.get("name")?.toString();

    if (!name) setNameError("faltou inserir o nome da máquina");
    if (sensorId == "") setSensorIdError("faltou selecionar o sensor");
    if (machineId == "") setMachineIdError("faltou selecionar a máquina");
    if (!name || sensorId == "" || machineId == "") return;

    const responseStatus = await post(
      {
        id: null,
        name: name || "",
        sensorId: parseInt(sensorId),
        machineId: parseInt(machineId),
      },
      session
    );

    if (responseStatus == postResultMsg.DATA_CONFLICT)
      setConflictNameError(postResultMsg.DATA_CONFLICT);

    if (responseStatus == postResultMsg.SUCCESS) router.push("/");
  };

  const getAllLists = async () => {
    const sensorsResponse = await getAll("/api/sensor/read/all", session);
    if (typeof sensorsResponse == "string") {
      setSensorListError(sensorsResponse);
    } else if (Array.isArray(sensorsResponse)) {
      setSensorList(sensorsResponse as Sensor[]);
      setSensorListError(null);
    }
    const machineResponse = await getAll("/api/machine/read/all", session);
    if (typeof machineResponse == "string") {
      setMachineListError(machineResponse);
    } else if (Array.isArray(machineResponse)) {
      setMachineList(machineResponse as Machine[]);
      setMachineListError(null);
    }
    setListsIsReady(true);
  };

  useEffect(() => {
    if (session?.token) getAllLists();
  }, [session?.token]);

  useEffect(() => {
    if (machine?.type == "Pump" && sensor?.model != "HF+") {
      setConflictSensorModelError(
        "O tipo Pump de máquina só pode ser associado com o modelo HF+ de sensor"
      );
    } else setConflictSensorModelError(null);
  }, [machine, sensor]);

  useEffect(() => {
    if (nameError || sensorIdError || machineIdError)
      setError("preencha o formulário corretamente");
    else if (conflictNameError) setError(conflictNameError);
    else setError(null);
  });

  // useEffect(() => {
  //   console.log(error);
  // }, [error]);

  const handleSetSensorId = (e: SelectChangeEvent) => {
    e.preventDefault();
    setSensorId(e.target.value);
    const sensor = sensorList.find(
      (value) => value.id == parseInt(e.target.value)
    );
    if (sensor) setSensor(sensor);
  };

  const handleSetMachineId = (e: SelectChangeEvent) => {
    e.preventDefault();
    setMachineId(e.target.value);
    const machine = machineList.find(
      (value) => value.id == parseInt(e.target.value)
    );
    if (machine) setMachine(machine);
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
      {" "}
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
          Criar Ponto de Monitoramento
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Nome da Máquina"
            name="name"
            autoFocus
            error={!!nameError}
            helperText={nameError}
            onChange={() => {
              setNameError(null);
              setConflictNameError(null);
            }}
            inputProps={{ "data-testid": "name-input" }}
          />
          {listsIsReady && (
            <FormControl sx={{ marginTop: 1, width: "100%" }}>
              <InputLabel id="sensor-label">Sensor</InputLabel>
              <Select
                value={sensorId}
                fullWidth
                labelId="sensor-label"
                id="sensor"
                label="Sensor"
                onChange={(e) => {
                  handleSetSensorId(e);
                  setSensorIdError(null);
                }}
                error={!!conflictSensorModelError || !!sensorListError}
                data-testid="sensor-input"
              >
                {sensorList.map((sensor) => (
                  <MenuItem key={sensor.id} value={sensor.id || 0}>
                    {sensor.name + " | " + sensor.model}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {listsIsReady && sensorListError && (
            <Alert severity="error">{sensorListError}</Alert>
          )}
          {listsIsReady && (
            <FormControl sx={{ marginTop: 1, width: "100%" }}>
              <InputLabel id="machine-label">Máquina</InputLabel>
              <Select
                value={machineId}
                fullWidth
                labelId="machine-label"
                id="machine"
                label="Máquina"
                onChange={(e) => {
                  handleSetMachineId(e);
                  setMachineIdError(null);
                }}
                error={!!conflictSensorModelError || !!machineListError}
                data-testid="machine-input"
              >
                {machineList.map((machine) => (
                  <MenuItem key={machine.id} value={machine.id || 0}>
                    {machine.name + " | " + machine.type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {listsIsReady && sensorListError && (
            <Alert severity="error">{sensorListError}</Alert>
          )}
          {listsIsReady && conflictSensorModelError && (
            <Alert severity="error">{conflictSensorModelError}</Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            color={
              !!error || !!conflictSensorModelError || !!machineListError
                ? "error"
                : "primary"
            }
            disabled={
              !listsIsReady ||
              !!error ||
              !!conflictSensorModelError ||
              !!machineListError
            }
            data-testid="submit-button"
          >
            Criar Ponto de Monitoramento
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
