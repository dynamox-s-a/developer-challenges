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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { v4 as uuidv4 } from "uuid";
import { useDispatch } from "react-redux";
import { logout } from "../../features/authSlice";
import { useRouter } from "next/navigation";
import withAuth from "../withAuth";

interface Sensor {
  id: string;
  name: string;
  type: string;
}

interface MonitoringPoint {
  id: string;
  name: string;
  sensors: Sensor[];
}

interface Machine {
  id: string;
  name: string;
  type: "Pump" | "Fan";
  monitoringPoints: MonitoringPoint[];
}

const MachineList = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [machines, setMachines] = useState<Machine[]>([]);
  const [newMachine, setNewMachine] = useState<Machine>({
    id: "",
    name: "",
    type: "Pump",
    monitoringPoints: [],
  });

  const [newMonitoringPoint, setNewMonitoringPoint] = useState<MonitoringPoint>(
    {
      id: "",
      name: "",
      sensors: [],
    }
  );

  const [newSensor, setNewSensor] = useState<Sensor>({
    id: "",
    name: "",
    type: "",
  });

  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleAddMachine = () => {
    const newMachineData: Machine = {
      ...newMachine,
      id: Date.now().toString(),
    };
    setMachines([...machines, newMachineData]);
    setNewMachine({ id: "", name: "", type: "Pump", monitoringPoints: [] });
  };

  const handleDeleteMachine = (id: string) => {
    setMachines(machines.filter((machine) => machine.id !== id));
  };

  const handleAddMonitoringPoint = () => {
    if (selectedMachine) {
      const updatedMachine = {
        ...selectedMachine,
        monitoringPoints: [
          ...selectedMachine.monitoringPoints,
          { ...newMonitoringPoint, id: Date.now().toString(), sensors: [] },
        ],
      };

      setMachines(
        machines.map((machine) =>
          machine.id === selectedMachine.id ? updatedMachine : machine
        )
      );
      setNewMonitoringPoint({ id: "", name: "", sensors: [] });
      setSelectedMachine(updatedMachine);
    }
  };

  const handleAddSensor = () => {
    if (selectedMachine) {
      const lastMonitoringPoint =
        selectedMachine.monitoringPoints[
          selectedMachine.monitoringPoints.length - 1
        ];

      if (lastMonitoringPoint) {
        const updatedMachine = {
          ...selectedMachine,
          monitoringPoints: selectedMachine.monitoringPoints.map((mp) =>
            mp.id === lastMonitoringPoint.id
              ? {
                  ...mp,
                  sensors: [...mp.sensors, { ...newSensor, id: uuidv4() }],
                }
              : mp
          ),
        };

        setMachines(
          machines.map((machine) =>
            machine.id === selectedMachine.id ? updatedMachine : machine
          )
        );

        setSelectedMachine(updatedMachine);
        setNewSensor({ id: "", name: "", type: "" });
      } else {
        alert("Adicione um ponto de monitoramento primeiro.");
      }
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
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
            style={{ display: "flex", flexDirection: "column" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <span>
                {machine.name} - {machine.type}
              </span>
              <div>
                <IconButton onClick={() => handleDeleteMachine(machine.id)}>
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  onClick={() => {
                    setSelectedMachine(machine);
                    setOpenDialog(true);
                  }}
                >
                  <EditIcon />
                </IconButton>
              </div>
            </div>

            {machine.monitoringPoints.map((point) => (
              <div key={point.id} style={{ marginLeft: "20px" }}>
                <strong>{point.name}</strong>
                <ul>
                  {point.sensors.map((sensor) => (
                    <li key={sensor.id}>
                      {sensor.name} - {sensor.type}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </ListItem>
        ))}
      </List>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Adicionar Ponto de Monitoramento</DialogTitle>
        <DialogContent>
          <TextField
            label="Nome do Ponto de Monitoramento"
            value={newMonitoringPoint.name}
            onChange={(e) =>
              setNewMonitoringPoint({
                ...newMonitoringPoint,
                name: e.target.value,
              })
            }
          />
          <Button variant="contained" onClick={handleAddMonitoringPoint}>
            Adicionar Ponto
          </Button>

          <h4>Adicionar Sensor</h4>
          <TextField
            label="Nome do Sensor"
            value={newSensor.name}
            onChange={(e) =>
              setNewSensor({ ...newSensor, name: e.target.value })
            }
          />
          <TextField
            label="Tipo do Sensor"
            value={newSensor.type}
            onChange={(e) =>
              setNewSensor({ ...newSensor, type: e.target.value })
            }
          />
          <Button
            variant="contained"
            onClick={() => {
              if (selectedMachine) {
                const lastMonitoringPoint =
                  selectedMachine.monitoringPoints[
                    selectedMachine.monitoringPoints.length - 1
                  ];
                if (lastMonitoringPoint) {
                  handleAddSensor(lastMonitoringPoint.id);
                }
              }
            }}
          >
            Adicionar Sensor
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
      <div>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default withAuth(MachineList);
