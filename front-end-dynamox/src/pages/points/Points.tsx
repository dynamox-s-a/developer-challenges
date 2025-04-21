import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
  Pagination,
} from "@mui/material";
import {
  getMonitoringPoints,
  createMonitoringPoint,
} from "../../services/monitoringPointService";
import { getMachines } from "../../services/machineService";
import { Machine, MonitoringPoint } from "../../types/monitoringPoint";
import MonitoringPointTable from "../../components/table/MonitoringPointsTable";

export default function Points() {
  const [monitoringPoints, setMonitoringPoints] = useState<MonitoringPoint[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [total, setTotal] = useState(0);

  const [selectedMachineId, setSelectedMachineId] = useState("");
  const [pointName, setPointName] = useState("");
  const [sensorModel, setSensorModel] = useState("");
  const [serialNumber, setSerialNumber] = useState("");

  const fetchMonitoringPoints = useCallback(async () => {
    try {
      const res = await getMonitoringPoints(page, sortBy, order);
      setMonitoringPoints(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      console.error("Erro ao buscar monitoring points", err);
    }
  }, [page, sortBy, order]);

  const fetchMachines = async () => {
    try {
      const res = await getMachines();
      setMachines(res.data);
    } catch (err) {
      console.error("Erro ao buscar máquinas", err);
    }
  };

  useEffect(() => {
    fetchMonitoringPoints();
  }, [fetchMonitoringPoints]);

  useEffect(() => {
    fetchMachines();
  }, []);

  const handleCreate = async () => {
    if (!selectedMachineId || !pointName || !sensorModel || !serialNumber) return;

    const selectedMachine = machines.find((m) => m._id === selectedMachineId);

    if (selectedMachine?.type === "Pump" && sensorModel !== "HF+") {
      alert("Machines of type Pump can only have sensors of type HF+");
      return;
    }

    try {
      await createMonitoringPoint({
        machineId: selectedMachineId,
        name: pointName,
        sensor: {
          model: sensorModel as "TcAg" | "TcAs" | "HF+",
          serialNumber,
        },
      });

      setSelectedMachineId("");
      setPointName("");
      setSensorModel("");
      setSerialNumber("");
      fetchMonitoringPoints();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error(err.response?.data || err.message);
      } else {
        console.error(err);
      }
    }
  };

  const handleSortChange = (field: string) => {
    setSortBy(field);
    setOrder(order === "asc" ? "desc" : "asc");
  };

  return (
    <Box p={4}       
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      padding: 6,
      gap: 4,
      backgroundColor: '#f9f9f9',
      minHeight: '100vh',
    }}>
      <Typography variant="h4" gutterBottom>
        Monitoring Points
      </Typography>

      <Box display="flex" gap={2} mb={4} flexWrap="wrap">
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Machine</InputLabel>
          <Select
            value={selectedMachineId}
            label="Machine"
            onChange={(e) => setSelectedMachineId(e.target.value)}
          >
            {machines.map((m) => (
              <MenuItem key={m._id} value={m._id}>
                {m.name} ({m.type})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Monitoring Point Name"
          value={pointName}
          onChange={(e) => setPointName(e.target.value)}
        />

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Sensor</InputLabel>
          <Select
            value={sensorModel}
            label="Sensor"
            onChange={(e) => setSensorModel(e.target.value)}
          >
            <MenuItem value="TcAg">TcAg</MenuItem>
            <MenuItem value="TcAs">TcAs</MenuItem>
            <MenuItem value="HF+">HF+</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Serial Number"
          value={serialNumber}
          onChange={(e) => setSerialNumber(e.target.value)}
        />

        <Button variant="contained" onClick={handleCreate}>
          Add
        </Button>
      </Box>

      <MonitoringPointTable
        data={monitoringPoints}
        sortBy={sortBy}
        order={order}
        onSortChange={handleSortChange}
      />

      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={Math.ceil(total / 5) || 1}
          page={page}
          onChange={(_e, val) => setPage(val)}
        />
      </Box>
    </Box>
  );
}
