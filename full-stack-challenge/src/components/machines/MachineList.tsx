"use client";

import { useState } from "react";
import {
  Button,
  TextField,
  MenuItem,
  Select,
  List,
  ListItem,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

interface Machine {
  id: string;
  name: string;
  type: "Pump" | "Fan";
}

const MachineList = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [newMachine, setNewMachine] = useState<Machine>({
    id: "",
    name: "",
    type: "Pump",
  });

  const handleAddMachine = () => {
    if (newMachine.name) {
      const newMachineData: Machine = {
        ...newMachine,
        id: Date.now().toString(),
      };
      setMachines([...machines, newMachineData]);
      setNewMachine({ id: "", name: "", type: "Pump" });
    }
  };

  const handleDeleteMachine = (id: string) => {
    setMachines(machines.filter((machine) => machine.id !== id));
  };

  return (
    <div>
      <h2>Gerenciar Máquinas</h2>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <TextField
          label="Nome da Máquina"
          value={newMachine.name}
          onChange={(e) =>
            setNewMachine({ ...newMachine, name: e.target.value })
          }
        />
        <Select
          value={newMachine.type}
          onChange={(e) =>
            setNewMachine({
              ...newMachine,
              type: e.target.value as "Pump" | "Fan",
            })
          }
        >
          <MenuItem value="Pump">Pump</MenuItem>
          <MenuItem value="Fan">Fan</MenuItem>
        </Select>
        <Button variant="contained" onClick={handleAddMachine}>
          Adicionar Máquina
        </Button>
      </div>

      <List>
        {machines.map((machine) => (
          <ListItem
            key={machine.id}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <div>
              {machine.name} - {machine.type}
            </div>
            <div>
              <IconButton onClick={() => handleDeleteMachine(machine.id)}>
                <DeleteIcon />
              </IconButton>
              <IconButton>
                <EditIcon />
              </IconButton>
            </div>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default MachineList;
