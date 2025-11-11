import React, { useEffect, useState } from "react";
import {
  Typography,
  Divider,
  Paper,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { DashboardLayout } from "./layout";

const MACHINE_TYPES = ["Pump", "Fan"] as const;
type MachineType = (typeof MACHINE_TYPES)[number];

export function EditMachine(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [type, setType] = useState<MachineType | "">("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [severity, setSeverity] = useState<"success" | "error">("success");

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await api.get(`/machine/${id}`);
        if (!mounted) return;
        const m = res.data;
        setName(m?.name || "");
        setType(m?.type || "");
      } catch {
        setMessage("Não foi possível carregar a máquina");
        setSeverity("error");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (!name.trim() || !type) {
      setMessage("Nome e Tipo são obrigatórios");
      setSeverity("error");
      return;
    }
    try {
      setSaving(true);
      await api.put(`/machine/${id}`, { name: name.trim(), type });
      setMessage("Máquina atualizada com sucesso");
      setSeverity("success");
      setTimeout(() => navigate("/machines/manage"), 1000);
    } catch (err) {
      console.error(err);
      setMessage("Erro ao atualizar máquina");
      setSeverity("error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <Paper sx={{ p: { xs: 3, md: 5 }, maxWidth: 700, mx: "auto" }}>
        <Typography variant="h5" gutterBottom>
          Editar Máquina
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Snackbar
          open={!!message}
          autoHideDuration={9000}
          onClose={() => setMessage(null)}
        >
          <Alert severity={severity}>{message}</Alert>
        </Snackbar>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel id="type-label">Tipo</InputLabel>
            <Select
              labelId="type-label"
              value={type}
              label="Tipo"
              onChange={(e) => setType(e.target.value as MachineType)}
            >
              <MenuItem value="" disabled>
                Selecione
              </MenuItem>
              {MACHINE_TYPES.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
            <Button type="submit" variant="contained" disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
            <Button variant="outlined" onClick={() => navigate("/machines")}>
              Cancelar
            </Button>
          </Box>
        </Box>
      </Paper>
    </DashboardLayout>
  );
}
