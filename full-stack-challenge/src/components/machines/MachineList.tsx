"use client";

import { useEffect, useState } from "react";
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
import {
  fetchMachines,
  addMachine,
  updateMachine,
  deleteMachine,
  createMonitoringPoint,
  addSensorToMonitoringPoint,
} from "../../services/api";
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
  monitoringPoints: MonitoringPoint[]; // Adicionado o tipo correto para monitoringPoints
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

  const [showAddMonitoringPoint, setShowAddMonitoringPoint] = useState(false);
  const [showAddSensor, setShowAddSensor] = useState(false);

  useEffect(() => {
    const loadMachines = async () => {
      try {
        const data = await fetchMachines();
        setMachines(data);
      } catch (error) {
        console.error("Erro ao carregar máquinas:", error);
      }
    };

    loadMachines();
  }, []);

  const handleAddMachine = async () => {
    try {
      const machineData = await addMachine(newMachine);
      setMachines([...machines, machineData]);
      setNewMachine({ id: "", name: "", type: "Pump", monitoringPoints: [] });
    } catch (error) {
      console.error("Erro ao adicionar máquina:", error);
    }
  };

  const handleDeleteMachine = async (id: string) => {
    try {
      await deleteMachine(id);
      setMachines(machines.filter((machine) => machine.id !== id));
    } catch (error) {
      console.error("Erro ao excluir máquina:", error);
    }
  };

  const handleUpdateMachine = async () => {
    if (selectedMachine) {
      const updatedMachine = await updateMachine(
        selectedMachine.id,
        selectedMachine
      );
      setMachines(
        machines.map((machine) =>
          machine.id === updatedMachine.id ? updatedMachine : machine
        )
      );
      setOpenDialog(false);
    }
  };

  const handleAddMonitoringPoint = async () => {
    if (selectedMachine) {
      const monitoringPoint = {
        ...newMonitoringPoint,
        id: Date.now().toString(),
      };

      try {
        const createdPoint = await createMonitoringPoint(
          selectedMachine.id,
          monitoringPoint
        );
        const updatedMachine = {
          ...selectedMachine,
          monitoringPoints: [
            ...(selectedMachine.monitoringPoints || []),
            createdPoint,
          ], // Verificação de segurança
        };

        setMachines(
          machines.map((machine) =>
            machine.id === selectedMachine.id ? updatedMachine : machine
          )
        );
        setSelectedMachine(updatedMachine);
        setNewMonitoringPoint({ id: "", name: "", sensors: [] });
        setShowAddMonitoringPoint(false); // Ocultar após adicionar
      } catch (error) {
        console.error("Erro ao adicionar ponto de monitoramento:", error);
      }
    }
  };

  const handleAddSensor = async () => {
    if (selectedMachine) {
      const lastMonitoringPoint =
        selectedMachine.monitoringPoints?.[
          selectedMachine.monitoringPoints.length - 1
        ];

      if (lastMonitoringPoint) {
        try {
          const sensorData = { ...newSensor, id: uuidv4() };
          const updatedPoint = await addSensorToMonitoringPoint(
            lastMonitoringPoint.id,
            sensorData
          );

          const updatedMachine = {
            ...selectedMachine,
            monitoringPoints: selectedMachine.monitoringPoints.map((mp) =>
              mp.id === lastMonitoringPoint.id ? updatedPoint : mp
            ),
          };

          setMachines(
            machines.map((machine) =>
              machine.id === selectedMachine.id ? updatedMachine : machine
            )
          );
          setSelectedMachine(updatedMachine);
          setNewSensor({ id: "", name: "", type: "" });
          setShowAddSensor(false); // Ocultar após adicionar
        } catch (error) {
          console.error("Erro ao adicionar sensor:", error);
        }
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
                {Array.isArray(machine.monitoringPoints) &&
                machine.monitoringPoints.length > 0 ? (
                  machine.monitoringPoints.map((point) => (
                    <div key={point.id} style={{ marginLeft: "20px" }}>
                      <strong>{point.name}</strong>
                      <ul>
                        {Array.isArray(point.sensors) &&
                          point.sensors.map((sensor) => (
                            <li key={sensor.id}>
                              {sensor.name} ({sensor.type})
                            </li>
                          ))}
                      </ul>
                    </div>
                  ))
                ) : (
                  <p>Nenhum ponto de monitoramento disponível</p>
                )}
              </TableCell>
              <TableCell>
                <IconButton
                  onClick={() => {
                    setSelectedMachine(machine);
                    setOpenDialog(true);
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteMachine(machine.id)}>
                  <DeleteIcon />
                </IconButton>
                <Button
                  onClick={() => {
                    setSelectedMachine(machine);
                    setShowAddMonitoringPoint(true);
                  }}
                >
                  Adicionar Ponto
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialog de Atualização de Máquina */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Atualizar Máquina</DialogTitle>
        <DialogContent>
          <TextField
            label="Nome da Máquina"
            value={selectedMachine?.name || ""}
            onChange={(e) =>
              setSelectedMachine({ ...selectedMachine!, name: e.target.value })
            }
          />
          <Select
            value={selectedMachine?.type}
            onChange={(e) =>
              setSelectedMachine({
                ...selectedMachine!,
                type: e.target.value as "Pump" | "Fan",
              })
            }
          >
            <MenuItem value="Pump">Pump</MenuItem>
            <MenuItem value="Fan">Fan</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleUpdateMachine}>Salvar</Button>
        </DialogActions>
      </Dialog>

      {/* Adicionar Ponto de Monitoramento */}
      {showAddMonitoringPoint && (
        <div style={{ marginTop: "20px" }}>
          <h3>Adicionar Ponto de Monitoramento</h3>
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
          <Button onClick={() => setShowAddMonitoringPoint(false)}>
            Cancelar
          </Button>
        </div>
      )}

      {/* Adicionar Sensor */}
      {showAddSensor && (
        <div style={{ marginTop: "20px" }}>
          <h3>Adicionar Sensor</h3>
          <TextField
            label="Nome do Sensor"
            value={newSensor.name}
            onChange={(e) =>
              setNewSensor({ ...newSensor, name: e.target.value })
            }
          />
          <TextField
            label="Tipo de Sensor"
            value={newSensor.type}
            onChange={(e) =>
              setNewSensor({ ...newSensor, type: e.target.value })
            }
          />
          <Button variant="contained" onClick={handleAddSensor}>
            Adicionar Sensor
          </Button>
          <Button onClick={() => setShowAddSensor(false)}>Cancelar</Button>
        </div>
      )}

      <Button
        variant="contained"
        onClick={handleLogout}
        style={{ marginTop: "20px" }}
      >
        Sair
      </Button>
    </div>
  );
};

export default withAuth(MachineList);
