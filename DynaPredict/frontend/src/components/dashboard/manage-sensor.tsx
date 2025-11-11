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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { DashboardLayout } from "./layout";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";

interface Sensor {
  id: string;
  name?: string;
  model: string;
}

export function SensorManagement(): React.JSX.Element {
  const navigate = useNavigate();
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function getSensors() {
    try {
      setLoading(true);
      const res = await api.get("/sensor");
      setSensors(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch sensors:", err);
      setSensors([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getSensors();
  }, []);

  async function handleDelete(id: string) {
    try {
      setDeletingId(id);
      await api.delete(`/sensor/${id}`);
      setSensors((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Failed to delete sensor:", err);
      window.alert("Erro ao excluir sensor");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <DashboardLayout>
      <Typography variant="h4" gutterBottom>
        Gestão de Sensores: Gerenciar
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/sensors/create")}
        >
          Novo Sensor
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
            <Table stickyHeader aria-label="tabela de sensores">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", width: "20%" }}>
                    Sensor ID
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      width: "35%",
                      textAlign: "center",
                    }}
                  >
                    Modelo
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      width: "55%",
                      textAlign: "center",
                    }}
                  >
                    Ações
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sensors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      Nenhum sensor cadastrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  sensors.map((s) => (
                    <TableRow hover key={s.id}>
                      <TableCell>{s.id}</TableCell>
                      <TableCell align="center">{s.model}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={
                            deletingId === s.id ? (
                              <CircularProgress size={16} />
                            ) : (
                              <DeleteIcon />
                            )
                          }
                          onClick={() => handleDelete(s.id)}
                        >
                          Excluir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Paper>
    </DashboardLayout>
  );
}
