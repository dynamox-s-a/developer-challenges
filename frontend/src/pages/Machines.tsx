import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { Plus, Edit, Trash, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {
  getMachines,
  createMachine,
  updateMachine,
  deleteMachine,
  Machine,
  MachineType,
} from "../services/api";

export default function Machines() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentMachine, setCurrentMachine] = useState<Machine | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: MachineType.Pump,
  });

  const fetchMachines = async () => {
    try {
      setLoading(true);
      const data = await getMachines();
      setMachines(data);
    } catch (error) {
      console.error("Failed to fetch machines:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  const handleOpenDialog = (machine?: Machine) => {
    if (machine) {
      setCurrentMachine(machine);
      setFormData({
        name: machine.name,
        type: machine.type as MachineType,
      });
    } else {
      setCurrentMachine(null);
      setFormData({
        name: "",
        type: MachineType.Pump,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDeleteDialog = (machine: Machine) => {
    setCurrentMachine(machine);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as string]: value,
    });
  };

  const handleSelectChange = (e: SelectChangeEvent<MachineType>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as string]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      if (currentMachine) {
        await updateMachine(
          currentMachine.id,
          formData.name,
          formData.type as MachineType,
        );
        toast.success("Machine updated successfully");
      } else {
        await createMachine(formData.name, formData.type as MachineType);
        toast.success("Machine created successfully");
      }
      handleCloseDialog();
      fetchMachines();
    } catch (error) {
      console.error("Error saving machine:", error);
    }
  };

  const handleDelete = async () => {
    try {
      if (currentMachine) {
        await deleteMachine(currentMachine.id);
        toast.success("Machine deleted successfully");
        handleCloseDeleteDialog();
        fetchMachines();
      }
    } catch (error) {
      console.error("Error deleting machine:", error);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Máquinas
        </Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={() => handleOpenDialog()}
        >
          Adicionar Máquina
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={1}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Criado em</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : machines.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <AlertCircle size={24} />
                    <Typography>Nenhuma máquina encontrada</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              machines.map((machine) => (
                <TableRow key={machine.id}>
                  <TableCell>{machine.id}</TableCell>
                  <TableCell>{machine.name}</TableCell>
                  <TableCell>{machine.type}</TableCell>
                  <TableCell>
                    {new Date(machine.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Editar">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(machine)}
                      >
                        <Edit size={18} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Deletar">
                      <IconButton
                        color="error"
                        onClick={() => handleOpenDeleteDialog(machine)}
                      >
                        <Trash size={18} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {currentMachine ? "Editar máquina" : "Adicionar máquina"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              name="name"
              label="Nome"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.name}
              onChange={handleFormChange}
              required
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="type-label">Tipo da máquina</InputLabel>
              <Select
                labelId="type-label"
                id="type"
                name="type"
                value={formData.type}
                label="Machine Type"
                onChange={handleSelectChange}
              >
                <MenuItem value={MachineType.Pump}>Pump</MenuItem>
                <MenuItem value={MachineType.Fan}>Fan</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.name}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Machine</DialogTitle>
        <DialogContent>
          <Typography>
            Você tem certeza que deseja deletar a máquina "
            {currentMachine?.name}
            "?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Deletar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
