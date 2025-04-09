import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  Button,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchMachines, deleteMachine } from "../store/machines/machineThunks";
import { updateMachine } from "../store/machines/machineThunks";
import { Machine } from "../store/machines/machineTypes";

const MachineList = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { items: machines, status, error } = useSelector((state: RootState) => state.machines);

  const startEdit = (machine: Machine) => {
    setEditId(machine.id);
    setEditedName(machine.name);
    setEditedType(machine.type);
  };

  const [editId, setEditId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedType, setEditedType] = useState<"Pump" | "Fan">("Pump");

  const cancelEdit = () => {
    setEditId(null);
  };
  const saveEdit = () => {
    if (editId !== null) {
      dispatch(
        updateMachine({
          id: editId,
          name: editedName,
          type: editedType,
        })
      );
      setEditId(null);
    }
  };

  useEffect(() => {
    dispatch(fetchMachines());
  }, [dispatch]);

  if (status === "loading") return <p>Carregando...</p>;
  if (status === "failed") return <p>Erro: {error}</p>;

  const handleDelete = (id: string) => {
    if (window.confirm("Deseja realmente excluir esta máquina?")) {
      dispatch(deleteMachine(id));
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {machines?.map((machine: Machine) => (
            <TableRow key={machine.id}>
              <TableCell>
                {editId === machine.id ? (
                  <TextField
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    size="small"
                  />
                ) : (
                  machine.name
                )}
              </TableCell>
              <TableCell>
                {editId === machine.id ? (
                  <Select
                    value={editedType}
                    onChange={(e) => setEditedType(e.target.value as "Pump" | "Fan")}
                    size="small"
                  >
                    <MenuItem value="Pump">Pump</MenuItem>
                    <MenuItem value="Fan">Fan</MenuItem>
                  </Select>
                ) : (
                  machine.type
                )}
              </TableCell>
              <TableCell align="right">
                {editId === machine.id ? (
                  <>
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      onClick={saveEdit}
                      style={{ marginRight: "0.5rem" }}
                    >
                      Salvar
                    </Button>
                    <Button variant="outlined" size="small" onClick={cancelEdit}>
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outlined"
                      size="small"
                      style={{ marginRight: "0.5rem" }}
                      onClick={() => startEdit(machine)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(machine.id)}
                    >
                      Excluir
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MachineList;
