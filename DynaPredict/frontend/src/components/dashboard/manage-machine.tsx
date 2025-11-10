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
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { DashboardLayout } from "./layout";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";

interface Machine {
  id: number;
  name: string;
  type: string;
}

export function MachineManagement(): React.JSX.Element {
  const navigate = useNavigate();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function getMachine() {
    try {
      setLoading(true);
      const response = await api.get("/machine", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      });
      setMachines(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to fetch machines:", err);
      setMachines([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getMachine();
  }, []);

  async function handleDelete(id: number) {
    try {
      setDeletingId(id);
      await api.delete(`/machine/${id}`);
      setMachines((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error("Failed to delete machine:", err);
      // simple user feedback — replace with Snackbar if you prefer
      window.alert("Erro ao excluir máquina");
    } finally {
    //   getMachine();
      setDeletingId(null);
    }
  }

  return (
    <DashboardLayout>
      <Typography variant="h4" gutterBottom>
        Gestão de Máquinas: Gerenciar
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/machines/create")}
        >
          Nova Máquina
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
            <Table stickyHeader aria-label="tabela de máquinas">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", width: "50%" }}>
                    Nome da Máquina
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", width: "30%" }}>
                    Tipo
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      width: "20%",
                      textAlign: "center",
                    }}
                  >
                    Ações
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {machines.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      Nenhuma máquina cadastrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  machines.map((machine) => (
                    <TableRow hover key={machine.id}>
                      <TableCell>{machine.name}</TableCell>
                      <TableCell>{machine.type}</TableCell>
                      <TableCell
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          gap: 1,
                        }}
                      >
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          startIcon={<AddIcon />}
                          onClick={() =>
                            navigate(`/machines/${machine.id}/edit`)
                          }
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={
                            deletingId === machine.id ? (
                              <CircularProgress size={16} />
                            ) : (
                              <DeleteIcon />
                            )
                          }
                          onClick={() => handleDelete(machine.id)}
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
