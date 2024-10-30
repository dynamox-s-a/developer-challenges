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
  Box,
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

  const [currentPage] = useState(0);
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
          ],
        };

        setMachines(
          machines.map((machine) =>
            machine.id === selectedMachine.id ? updatedMachine : machine
          )
        );
        setSelectedMachine(updatedMachine);
        setNewMonitoringPoint({ id: "", name: "", sensors: [] });
        setShowAddMonitoringPoint(false);
        setShowAddSensor(true);
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
          const sensorData = { id: uuidv4(), model: newSensor.type };
          const updatedPoint = await addSensorToMonitoringPoint(
            selectedMachine.id,
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
          setShowAddSensor(false);
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
    <Box
      sx={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "darkgrey",
        padding: "20px",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ marginBottom: "20px" }}>Gerenciar Máquinas</h2>
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
          <Button
            variant="contained"
            onClick={handleAddMachine}
            style={{ backgroundColor: "#696969" }}
          >
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
                              <li key={sensor.id}>{sensor.name}</li>
                            ))}
                        </ul>
                      </div>
                    ))
                  ) : (
                    <p>Nenhum ponto de monitoramento</p>
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
                    variant="outlined"
                    onClick={() => {
                      setSelectedMachine(machine);
                      setShowAddMonitoringPoint(true);
                    }}
                    style={{ color: "white", backgroundColor: "#696969" }}
                  >
                    Adicionar Ponto de Monitoramento
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Editar Máquina</DialogTitle>
          <DialogContent>
            <TextField
              label="Nome da Máquina"
              value={selectedMachine?.name || ""}
              onChange={(e) =>
                setSelectedMachine((prev) => ({
                  ...prev!,
                  name: e.target.value,
                }))
              }
            />
            <Select
              value={selectedMachine?.type || ""}
              onChange={(e) =>
                setSelectedMachine((prev) => ({
                  ...prev!,
                  type: e.target.value as "Pump" | "Fan",
                }))
              }
            >
              <MenuItem value="Pump">Pump</MenuItem>
              <MenuItem value="Fan">Fan</MenuItem>
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleUpdateMachine}>Salvar</Button>
            <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={showAddMonitoringPoint}
          onClose={() => setShowAddMonitoringPoint(false)}
        >
          <DialogTitle>Adicionar Ponto de Monitoramento</DialogTitle>
          <DialogContent>
            <TextField
              label="Nome do Ponto"
              value={newMonitoringPoint.name}
              onChange={(e) =>
                setNewMonitoringPoint({
                  ...newMonitoringPoint,
                  name: e.target.value,
                })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddMonitoringPoint}>Adicionar Ponto</Button>
            <Button onClick={() => setShowAddMonitoringPoint(false)}>
              Cancelar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={showAddSensor} onClose={() => setShowAddSensor(false)}>
          <DialogTitle>Adicionar Sensor</DialogTitle>
          <DialogContent>
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
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddSensor}>Adicionar Sensor</Button>
            <Button onClick={() => setShowAddSensor(false)}>Cancelar</Button>
          </DialogActions>
        </Dialog>

        <Button
          style={{
            marginTop: "2%",
            color: "white",
            backgroundColor: "#696969",
          }}
          onClick={handleLogout}
        >
          Sair
        </Button>
      </div>
    </Box>
  );
};

export default withAuth(MachineList);
