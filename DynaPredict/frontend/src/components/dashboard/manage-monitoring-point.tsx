import React, { useEffect, useState } from "react";
import {
  Typography,
  Divider,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import LinkIcon from "@mui/icons-material/Link";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import { DashboardLayout } from "./layout";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";

interface MonitoringPoint {
  id: number;
  monitoring_point_name: string;
  machine_name?: string;
  machine_type?: string;
  sensor_model?: string;
  sensor_id?: string | null; // Manter para lógica de associação
}

interface Sensor {
  id: number;
  model: string;
}

export function MonitoringPointManagement(): React.JSX.Element {
  const navigate = useNavigate();
  const [points, setPoints] = useState<MonitoringPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSensors, setLoadingSensors] = useState(false);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<MonitoringPoint | null>(
    null
  );
  const [selectedSensorId, setSelectedSensorId] = useState<string>("");
  const [actionState, setActionState] = useState<{
    id: number | null;
    type: "associating" | "removing";
  } | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    message: string;
    severity: "success" | "error";
  } | null>(null);

  const loadPoints = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/monitoring-point", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      });
      // A API retorna 'monitoring_point_id' como o ID principal.
      const data = (res.data.items || res.data.data || res.data || []).map(
        (item: any, index: number) => ({
          ...item,
          id: item.monitoring_point_id, // Usar diretamente o campo da API
        })
      );
      console.log(data);
      setPoints(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load monitoring points:", err);
      setStatusMessage({
        message: "Falha ao carregar pontos de monitoramento.",
        severity: "error",
      });
      setPoints([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPoints();
  }, [loadPoints]);

  async function openAssociateDialog(p: MonitoringPoint) {
    setSelectedPoint(p);
    setSelectedSensorId("");
    setDialogOpen(true);

    try {
      setLoadingSensors(true);
      const res = await api.get("/sensor");
      let availableSensors: Sensor[] = res.data.data || res.data || [];

      // Regra: Não associar 'TcAg' e 'TcAs' em máquinas 'Pump'
      const machineType = (p.machine_type || "").toLowerCase();
      if (machineType === "pump") {
        availableSensors = availableSensors.filter(
          (s) => !["TcAg", "TcAs"].includes(s.model)
        );
      }

      setSensors(availableSensors);
    } catch (err) {
      console.error("Failed to load sensors:", err);
      setSensors([]);
      setStatusMessage({
        message: "Falha ao carregar sensores.",
        severity: "error",
      });
    } finally {
      setLoadingSensors(false);
    }
  }

  async function handleAssociate() {
    if (!selectedPoint || !selectedSensorId) return;

    setActionState({ id: selectedPoint.id, type: "associating" });
    try {
      // Endpoint atualizado para /monitoring-point/assign
      await api.post(`/monitoring-point/assign`, {
        sensor_id: Number(selectedSensorId), // Garante que o ID é um número
        monitoring_point_id: selectedPoint.id,
      });

      setStatusMessage({
        message: "Sensor associado com sucesso.",
        severity: "success",
      });
      setDialogOpen(false);

      // Recarrega os pontos para obter o estado mais recente do backend
    } catch (err) {
      console.error(err);
      setStatusMessage({
        message: "Erro ao associar sensor.",
        severity: "error",
      });
    } finally {
      loadPoints();
      setActionState(null);
    }
  }

  async function handleDissociate(pointId: number) {
    setActionState({ id: pointId, type: "removing" });
    try {
      await api.delete(`/monitoring-point/${pointId}/sensor`);
      // Atualiza o estado local para refletir a remoção

      setStatusMessage({
        message: "Associação removida com sucesso.",
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setStatusMessage({
        message: "Erro ao remover associação.",
        severity: "error",
      });
    } finally {
      loadPoints();
      setActionState(null);
    }
  }

  function handleDeleteMonitoringPoint(pointId?: number): void {
    // If no id provided, inform the user and abort
    if (typeof pointId === "undefined" || pointId === null) {
      setStatusMessage({
        message: "ID do ponto de monitoramento não fornecido.",
        severity: "error",
      });
      return;
    }

    (async () => {
      setLoading(true);
      try {
        await api.delete(`/monitoring-point/${pointId}`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        });
        setStatusMessage({
          message: "Ponto de monitoramento excluído com sucesso.",
          severity: "success",
        });
        await loadPoints();
      } catch (err) {
        console.error("Erro ao excluir ponto de monitoramento:", err);
        setStatusMessage({
          message: "Erro ao excluir ponto de monitoramento.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    })();
  }

  return (
    <DashboardLayout>
      <Typography variant="h4" gutterBottom>
        Gestão de Pontos de Monitoramento
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<DeleteIcon />}
          onClick={() => navigate("/monitoring-points/remove")}
        >
          Delete ponto de monitoramento
        </Button>
      </Box>

      <Paper
        elevation={3}
        sx={{ width: "100%", overflow: "hidden", borderRadius: 2 }}
      >
        <TableContainer sx={{ maxHeight: 600 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Table stickyHeader aria-label="tabela de pontos">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Ponto de Monitoramento
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Máquina</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Tipo da Máquina
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                    Sensor Associado
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                    Ações
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {points.map((p) => (
                  <TableRow hover key={p.id}>
                    <TableCell>{p.monitoring_point_name}</TableCell>
                    <TableCell>{p.machine_name || "-"}</TableCell>
                    <TableCell>{p.machine_type || "-"}</TableCell>
                    <TableCell align="center">
                      {p.sensor_model || p.sensor_id || "Nenhum"}
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          gap: 1,
                        }}
                      >
                        <Tooltip title="Associar Sensor">
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<LinkIcon />}
                            onClick={() => openAssociateDialog(p)}
                          >
                            Associar
                          </Button>
                        </Tooltip>
                        {p.sensor_id && (
                          <Tooltip title="Remover Associação">
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              startIcon={
                                actionState?.id === p.id &&
                                actionState.type === "removing" ? (
                                  <CircularProgress size={16} />
                                ) : (
                                  <LinkOffIcon />
                                )
                              }
                              onClick={() => handleDissociate(p.id)}
                              disabled={actionState?.id === p.id}
                            >
                              Remover
                            </Button>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Paper>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Associar Sensor ao Ponto "{selectedPoint?.monitoring_point_name}"
        </DialogTitle>
        <DialogContent>
          {loadingSensors ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="sensor-select-label">
                Sensor Disponível
              </InputLabel>
              <Select
                labelId="sensor-select-label"
                value={selectedSensorId}
                label="Sensor Disponível"
                onChange={(e) => setSelectedSensorId(e.target.value as string)}
              >
                <MenuItem value="" disabled>
                  Selecione um sensor
                </MenuItem>
                {sensors.length === 0 ? (
                  <MenuItem value="" disabled>
                    Sem sensores disponíveis ou compatíveis
                  </MenuItem>
                ) : (
                  sensors.map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.model}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleAssociate}
            disabled={!selectedSensorId || actionState?.type === "associating"}
          >
            {actionState?.type === "associating" ? (
              <CircularProgress size={24} />
            ) : (
              "Associar"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!statusMessage}
        autoHideDuration={4000}
        onClose={() => setStatusMessage(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={statusMessage?.severity || "success"}
          onClose={() => setStatusMessage(null)}
        >
          {statusMessage?.message}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}
