import React, { useEffect, useState } from "react";
import {
  Typography,
  Divider,
  Paper,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DashboardLayout } from "./layout";
import { api } from "../../services/api";

interface MonitoringPointItem {
  id: number;
  monitoring_point_name: string;
  machine_name?: string;
  machine_type?: string;
}

export function RemoveMonitoringPoint(): React.JSX.Element {
  const [points, setPoints] = useState<MonitoringPointItem[]>([]);
  const [selectedId, setSelectedId] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    message: string;
    severity: "success" | "error";
  } | null>(null);

  async function loadPoints() {
    try {
      setLoading(true);
      const res = await api.get("/monitoring-point");
      const rawList = res.data.items || res.data.data || res.data || [];
      const data = (rawList as unknown[]).map((item) => {
        const it = item as Record<string, unknown>;
        const id = (it["monitoring_point_id"] ?? it["id"]) as number;
        const monitoring_point_name = (it["monitoring_point_name"] ??
          it["name"] ??
          "") as string;
        return {
          ...it,
          id,
          monitoring_point_name,
        } as MonitoringPointItem;
      });
      setPoints(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load monitoring points:", err);
      setStatusMessage({
        message: "Falha ao carregar pontos.",
        severity: "error",
      });
      setPoints([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPoints();
  }, []);

  async function handleDelete() {
    if (selectedId === "" || selectedId === null) {
      setStatusMessage({
        message: "Selecione um ponto para excluir.",
        severity: "error",
      });
      return;
    }


    try {
      setDeleting(true);
      await api.delete(`/monitoring-point/${selectedId}`);
      setStatusMessage({
        message: "Ponto excluído com sucesso.",
        severity: "success",
      });
      setSelectedId("");
      await loadPoints();
    } catch (err) {
      console.error("Erro ao excluir ponto:", err);
      setStatusMessage({
        message: "Erro ao excluir ponto.",
        severity: "error",
      });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <DashboardLayout>
      <Paper sx={{ p: { xs: 3, md: 4 }, maxWidth: 720, mx: "auto" }}>
        <Typography variant="h5" gutterBottom>
          Remover Ponto de Monitoramento
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="mp-select-label">Ponto de Monitoramento</InputLabel>
            <Select
              labelId="mp-select-label"
              value={selectedId}
              label="Ponto de Monitoramento"
              onChange={(e) => setSelectedId(e.target.value as number)}
              disabled={loading}
            >
              <MenuItem value="" disabled>
                Selecione um ponto
              </MenuItem>
              {points.length === 0 ? (
                <MenuItem value="" disabled>
                  Nenhum ponto disponível
                </MenuItem>
              ) : (
                points.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.monitoring_point_name}{" "}
                    {p.machine_name ? `— ${p.machine_name}` : ""}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
            disabled={deleting || selectedId === ""}
          >
            {deleting ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Excluir"
            )}
          </Button>
        </Box>

        <Snackbar
          open={!!statusMessage}
          autoHideDuration={4000}
          onClose={() => setStatusMessage(null)}
        >
          <Alert severity={statusMessage?.severity || "success"}>
            {statusMessage?.message}
          </Alert>
        </Snackbar>
      </Paper>
    </DashboardLayout>
  );
}

export default RemoveMonitoringPoint;
