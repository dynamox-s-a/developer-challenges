"use client";

import { useState } from "react";
import {
  Button,
  TextField,
  MenuItem,
  Select,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
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

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("");

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
        if (
          (newSensor.type === "TcAg" || newSensor.type === "TcAs") &&
          selectedMachine.type === "Pump"
        ) {
          alert(
            "Sensores 'TcAg' e 'TcAs' não são permitidos para máquinas do tipo 'Pump'."
          );
          return;
        }

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

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedMachines = [...machines].sort((a, b) => {
    const aValue = orderBy === "machineName" ? a.name : a.type;
    const bValue = orderBy === "machineName" ? b.name : b.type;

    if (aValue < bValue) {
      return order === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return order === "asc" ? 1 : -1;
    }
    return 0;
  });

  const paginatedMachines = sortedMachines.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

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

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={orderBy === "machineName"}
                direction={orderBy === "machineName" ? order : "asc"}
                onClick={() => handleRequestSort("machineName")}
              >
                Nome da Máquina
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "machineType"}
                direction={orderBy === "machineType" ? order : "asc"}
                onClick={() => handleRequestSort("machineType")}
              >
                Tipo da Máquina
              </TableSortLabel>
            </TableCell>
            <TableCell>Pontos de Monitoramento</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedMachines.map((machine) => (
            <TableRow key={machine.id}>
              <TableCell>{machine.name}</TableCell>
              <TableCell>{machine.type}</TableCell>
              <TableCell>
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
              </TableCell>
              <TableCell>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
          <Select
            value={newSensor.type}
            onChange={(e) =>
              setNewSensor({ ...newSensor, type: e.target.value })
            }
          >
            <MenuItem value="TcAg">TcAg</MenuItem>
            <MenuItem value="TcAs">TcAs</MenuItem>
            <MenuItem value="HF+">HF+</MenuItem>
          </Select>
          <Button variant="contained" onClick={handleAddSensor}>
            Adicionar Sensor
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>

      <Button variant="contained" onClick={handleLogout}>
        Logout
      </Button>
      <div>
        {currentPage > 0 && (
          <Button onClick={() => setCurrentPage(currentPage - 1)}>
            Anterior
          </Button>
        )}
        {currentPage < Math.ceil(sortedMachines.length / itemsPerPage) - 1 && (
          <Button onClick={() => setCurrentPage(currentPage + 1)}>
            Próximo
          </Button>
        )}
      </div>
    </div>
  );
};

export default withAuth(MachineList);
