import React, { useState } from "react";
import {
  Typography,
  Divider,
  Paper,
  Snackbar,
  Alert,
  Box,
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

const SENSOR_MODELS = ["TcAg", "TcAs", "HF+"] as const;
type SensorModel = (typeof SENSOR_MODELS)[number];

export function CreateSensor(): React.JSX.Element {
  const [model, setModel] = useState<SensorModel | "">("");
  const [statusMessage, setStatusMessage] = useState<{
    message: string;
    severity: "success" | "error";
  } | null>(null);
  const navigate = useNavigate();

  async function postSensor(model: string) {
    const response = await api.post("/sensor", { model });
    return response.data;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    if (!model) {
      setStatusMessage({ message: "Modelo é obrigatório.", severity: "error" });
      return;
    }

    try {
      await postSensor(model);
      setStatusMessage({
        message: `Sensor criado (modelo ${model}).`,
        severity: "success",
      });
      setModel("");
      setTimeout(() => navigate("/sensors/manage"), 800);
    } catch (err: unknown) {
      let msg = "Erro ao criar sensor";
      if (err && typeof err === "object") {
        // try to read axios-like error
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const maybe = err as any;
        msg = maybe?.response?.data?.message || maybe?.message || msg;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setStatusMessage({ message: String(msg), severity: "error" });
    }
  };

  const handleClose = () => setStatusMessage(null);

  return (
    <DashboardLayout>
      <Typography variant="h4" gutterBottom>
        Gestão de Sensores: Criar
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Paper
        elevation={3}
        sx={{ p: { xs: 3, md: 5 }, maxWidth: 600, mx: "auto", borderRadius: 3 }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ mb: 3, textAlign: "center" }}
        >
          <AddIcon sx={{ mr: 1, verticalAlign: "middle" }} /> Cadastrar Novo
          Sensor
        </Typography>

        <Snackbar
          open={!!statusMessage}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleClose}
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
          <FormControl fullWidth required>
            <InputLabel id="sensor-model-label">Modelo</InputLabel>
            <Select
              labelId="sensor-model-label"
              value={model}
              label="Modelo"
              onChange={(e) => setModel(e.target.value as SensorModel)}
            >
              <MenuItem value="" disabled>
                Selecione um modelo
              </MenuItem>
              {SENSOR_MODELS.map((m) => (
                <MenuItem key={m} value={m}>
                  {m}
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
            disabled={!model}
            startIcon={<AddIcon />}
          >
            Criar Sensor
          </Button>
        </Box>
      </Paper>
    </DashboardLayout>
  );
}
