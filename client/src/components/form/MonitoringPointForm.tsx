import {
    Box,
    TextField,
    Select,
    MenuItem,
    Button,
    InputLabel,
    FormControl,
  } from "@mui/material";
  import { useState } from "react";
  import { useAppDispatch } from "../../redux/store";
  import { createPoint } from "../../redux/monitoringPointsSlice";
  import { Machine } from "../../types/monitoringPoint";
  import { SelectChangeEvent } from '@mui/material';

  interface Props {
    machines: Machine[];
  }
  
  export default function MonitoringPointForm({ machines }: Props) {
    const dispatch = useAppDispatch();
  
    const [selectedMachineId, setSelectedMachineId] = useState("");
    const [pointName, setPointName] = useState("");
    const [sensorModel, setSensorModel] = useState("");
    const [serialNumber, setSerialNumber] = useState("");
  
    const handleCreate = () => {
      const selectedMachine = machines.find((m) => m._id === selectedMachineId);
  
      if (!selectedMachineId || !pointName || !sensorModel || !serialNumber) {
        alert("Please fill in all fields.");
        return;
      }
  
      if (selectedMachine?.type === "Pump" && sensorModel !== "HF+") {
        alert("Machines of type Pump can only have sensors of type HF+");
        return;
      }
  
      dispatch(
        createPoint({
          machineId: selectedMachineId,
          name: pointName,
          sensor: {
            model: sensorModel as "TcAg" | "TcAs" | "HF+",
            serialNumber,
          },
        })
      );
  
      setSelectedMachineId("");
      setPointName("");
      setSensorModel("");
      setSerialNumber("");
    };
  
    return (
      <Box display="flex" gap={2} mb={4} flexWrap="wrap">
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Machine</InputLabel>
          <Select
            value={selectedMachineId}
            label="Machine"
            onChange={(e: SelectChangeEvent<string>) => setSelectedMachineId(e.target.value)}
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
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setPointName(e.target.value)}
        />
  
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Sensor</InputLabel>
          <Select
            value={sensorModel}
            label="Sensor"
            onChange={(e: SelectChangeEvent<string>) => setSensorModel(e.target.value)}
          >
            <MenuItem value="TcAg">TcAg</MenuItem>
            <MenuItem value="TcAs">TcAs</MenuItem>
            <MenuItem value="HF+">HF+</MenuItem>
          </Select>
        </FormControl>
  
        <TextField
          label="Serial Number"
          value={serialNumber}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setSerialNumber(e.target.value)}
        />
  
        <Button variant="contained" onClick={handleCreate}>
          Add
        </Button>
      </Box>
    );
  }
  