import { Box, Button, MenuItem, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { createMonitoringPoint } from "../store/monitoring-point/monitoringPointThunks";
import { fetchMachines } from "../store/machines/machineThunks";
import { Machine } from "../store/machines/machineTypes";

const sensorOptions = ["TcAg", "TcAs", "HF+"];

const MonitoringPointForm = () => {
  const dispatch = useAppDispatch();
  const machines = useAppSelector((state) => state.machines.items);
  const machineStatus = useAppSelector((state) => state.machines.status);
  const [name, setName] = useState("");
  const [machineId, setMachineId] = useState("");
  const [sensorModel, setSensorModel] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (machineStatus === "idle") {
      dispatch(fetchMachines());
    }
  }, [dispatch, machineStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !machineId || !sensorModel) {
      setError("Todos os campos são obrigatórios.");
      return;
    }

    const machine: Machine | undefined = machines.find((m) => m.id === machineId);

    if (machine?.type === "Pump" && (sensorModel === "TcAg" || sensorModel === "TcAs")) {
      setError("Sensores TcAg e TcAs não podem ser usados em máquinas do tipo Pump.");
      return;
    }

    const result = await dispatch(createMonitoringPoint({ name, machineId, sensorModel }));

    if (createMonitoringPoint.rejected.match(result)) {
      setError(result.payload || "Erro ao criar ponto.");
    } else {
      setName("");
      setMachineId("");
      setSensorModel("");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} mb={4}>
      <Typography variant="h6" gutterBottom>
        Novo Ponto de Monitoramento
      </Typography>

      <TextField
        label="Nome do Ponto"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
      />

      <TextField
        select
        label="Máquina"
        value={machineId}
        onChange={(e) => setMachineId(e.target.value)}
        fullWidth
        margin="normal"
      >
        {machines.map((machine) => (
          <MenuItem key={machine.id} value={machine.id}>
            {machine.name} ({machine.type})
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Sensor"
        value={sensorModel}
        onChange={(e) => setSensorModel(e.target.value)}
        fullWidth
        margin="normal"
      >
        {sensorOptions.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>

      {error && <Typography color="error">{error}</Typography>}

      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        Criar Ponto
      </Button>
    </Box>
  );
};

export default MonitoringPointForm;
