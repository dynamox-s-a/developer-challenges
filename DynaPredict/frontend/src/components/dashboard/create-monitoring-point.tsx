import React, { useEffect, useState } from "react";
import {
  Typography,
  Divider,
  Paper,
  Snackbar,
  Alert,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { DashboardLayout } from "./layout";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";

interface Machine {
  id: number | string;
  name: string;
  type?: string;
}

export function CreateMonitoringPoint(): React.JSX.Element {
  const [name, setName] = useState("");
  const [machineId, setMachineId] = useState<string | number | "">("");
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loadingMachines, setLoadingMachines] = useState(false);
  const [statusMessage, setStatusMessage] = useState<null | {
    message: string;
    severity: "success" | "error";
  }>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingMachines(true);
      try {
        const res = await api.get("/machine");
        if (!mounted) return;
        setMachines(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load machines", err);
        setMachines([]);
      } finally {
        if (mounted) setLoadingMachines(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function postMonitoringPoint(
    nameVal: string,
    machineIdVal: string | number
  ) {
    const res = await api.post("/monitoring-point", {
      name: nameVal,
      machine_id: machineIdVal,
    });
    return res.data;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    if (!name.trim() || !machineId) {
      setStatusMessage({
        message: "Nome e Máquina são obrigatórios.",
        severity: "error",
      });
      return;
    }

    try {
      setSubmitting(true);
      await postMonitoringPoint(name.trim(), machineId);
      setStatusMessage({
        message: `Ponto de monitoramento "${name.trim()}" criado.`,
        severity: "success",
      });
      setName("");
      setMachineId("");
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err: unknown) {
      let msg = "Erro ao criar ponto";
      if (err && typeof err === "object") {
        const maybe = err as { response?: { data?: { message?: string } }; message?: string };
        msg = maybe?.response?.data?.message || maybe?.message || msg;
      } else if (err instanceof Error) msg = err.message;
      setStatusMessage({ message: String(msg), severity: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <Typography variant="h4" gutterBottom>
        Criar Ponto de Monitoramento
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Paper
        elevation={3}
        sx={{ p: { xs: 3, md: 5 }, maxWidth: 700, mx: "auto", borderRadius: 3 }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ mb: 3, textAlign: "center" }}
        >
          <AddIcon sx={{ mr: 1, verticalAlign: "middle" }} /> Novo Ponto
        </Typography>

        <Snackbar
          open={!!statusMessage}
          autoHideDuration={6000}
          onClose={() => setStatusMessage(null)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setStatusMessage(null)}
            severity={statusMessage?.severity || "success"}
            sx={{ width: "100%" }}
          >
            {statusMessage?.message}
          </Alert>
        </Snackbar>

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <TextField
            label="Nome do Ponto"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
            placeholder="Ex: Ponto Extrusora 1"
          />

          <FormControl fullWidth required>
            <InputLabel id="machine-select-label">Máquina</InputLabel>
            <Select
              labelId="machine-select-label"
              value={machineId}
              label="Máquina"
              onChange={(e) => setMachineId(e.target.value as string)}
            >
              <MenuItem value="" disabled>
                {loadingMachines
                  ? "Carregando máquinas..."
                  : "Selecione uma máquina"}
              </MenuItem>
              {machines.map((m) => (
                <MenuItem key={String(m.id)} value={m.id}>
                  {m.name} {m.type ? `— ${m.type}` : ""}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ py: 1.5, borderRadius: 2 }}
            disabled={!name.trim() || !machineId}
            startIcon={<AddIcon />}
          >
            Criar ponto
          </Button>

        </Box>
      </Paper>
    </DashboardLayout>
  );
}
