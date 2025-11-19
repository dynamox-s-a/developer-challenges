import React, { useState } from "react";
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

const MACHINE_TYPES = ["Pump", "Fan"] as const;
type MachineType = (typeof MACHINE_TYPES)[number];

export function CreateMachine(): React.JSX.Element {
  const [name, setName] = useState("");
  const [type, setType] = useState<MachineType | "">("");
  const [statusMessage, setStatusMessage] = useState<{
    message: string;
    severity: "success" | "error";
  } | null>(null);
  const navigate = useNavigate();

  async function postMachine(name: string, type: string) {
    console.log("Creating machine:", name, type);
    const response = await api.post(
      "/machine",
      { name, type },
      
    );

    console.log("response", response);

    return response.data;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const response = postMachine(name, type);
    console.log(response);
    setStatusMessage(null);

    if (!name.trim() || !type) {
      setStatusMessage({
        message: "Nome e Tipo da máquina são obrigatórios.",
        severity: "error",
      });
      return;
    }

    setStatusMessage({
      message: `Máquina "${name.trim()}" cadastrada com sucesso!`,
      severity: "success",
    });
    setName("");
    setType("");

    setTimeout(() => navigate("/machines/manage"), 100000);
  };

  const handleClose = () => setStatusMessage(null);

  return (
    <DashboardLayout>
      <Typography variant="h4" gutterBottom>
        Gestão de Máquinas
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
          <AddIcon sx={{ mr: 1, verticalAlign: "middle" }} /> Cadastrar Nova
          Máquina
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
          <TextField
            label="Nome da Máquina"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
            placeholder="Ex: Máquina Extrusora 01"
          />

          <FormControl fullWidth required>
            <InputLabel id="machine-type-label">Tipo da Máquina</InputLabel>
            <Select
              labelId="machine-type-label"
              value={type}
              label="Tipo da Máquina"
              onChange={(e) => setType(e.target.value as MachineType)}
            >
              <MenuItem value="" disabled>
                Selecione um tipo
              </MenuItem>
              {MACHINE_TYPES.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
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
            disabled={!name.trim() || !type}
            startIcon={<AddIcon />}
          >
            Criar Máquina
          </Button>
        </Box>
      </Paper>
    </DashboardLayout>
  );
}
