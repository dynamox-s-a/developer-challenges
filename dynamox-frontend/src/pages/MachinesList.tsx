import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchMachines } from "../store/machines/machineThunks";
import { Machine } from "../store/machines/machineSlice";
import { createMachine } from "../store/machines/machineThunks";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
} from "@mui/material";

const MachinesList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { machines, status, error } = useSelector((state: RootState) => state.machines);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<"Pump" | "Fan">("Pump");

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setName("");
    setType("Pump");
    setOpen(false);
  };

  const handleCreate = () => {
    dispatch(createMachine({ name, type }))
      .unwrap()
      .then(() => {
        handleClose();
      })
      .catch((err) => {
        console.error("Erro ao criar máquina:", err);
      });
  };

  useEffect(() => {
    dispatch(fetchMachines());
  }, [dispatch]);

  return (
    <Container>
      <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 2 }}>
        Nova Máquina
      </Button>

      <Typography variant="h4" gutterBottom>
        Lista de Máquinas
      </Typography>

      {status === "loading" && <Typography>Carregando...</Typography>}
      {status === "failed" && <Alert severity="error">{error}</Alert>}
      {status === "succeeded" && (
        <Paper elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Tipo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {machines.map((machine: Machine) => (
                <TableRow key={machine.id}>
                  <TableCell>{machine.name}</TableCell>
                  <TableCell>{machine.type}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Criar Máquina</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            select
            fullWidth
            label="Tipo"
            value={type}
            onChange={(e) => setType(e.target.value as "Pump" | "Fan")}
          >
            <MenuItem value="Pump">Pump</MenuItem>
            <MenuItem value="Fan">Fan</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleCreate} variant="contained" color="primary">
            Criar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MachinesList;
