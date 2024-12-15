import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TextField, Button, MenuItem } from "@mui/material";
import styled from "styled-components";
import { addMonitoringPoint } from "../redux/machinesSlice";
import { RootState } from "@/store/store";

interface Sensor {
  id: string;
  model: "TcAg" | "TcAs" | "HF+";
}

interface MonitoringPoint {
  id: string;
  machineId: string;
  name: string;
  sensor: Sensor;
}

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MonitoringPointForm: React.FC = () => {
  const dispatch = useDispatch();
  const machines = useSelector((state: RootState) => state.machines.machines);

  const [selectedMachineId, setSelectedMachineId] = useState<string>("");
  const [pointName, setPointName] = useState<string>("");
  const [sensorModel, setSensorModel] = useState<"TcAg" | "TcAs" | "HF+">(
    "HF+",
  );

  const selectedMachine = machines.find(
    (machine) => machine.id === selectedMachineId,
  );
  const machineType = selectedMachine?.type;

  const sensorModels =
    machineType === "Fan"
      ? [
          { value: "TcAg", label: "TcAg" },
          { value: "TcAs", label: "TcAs" },
          { value: "HF+", label: "HF+" },
        ]
      : machineType === "Pump"
        ? [{ value: "HF+", label: "HF+" }]
        : [];

  useEffect(() => {
    if (machineType === "Pump") {
      setSensorModel("HF+");
    } else if (
      machineType === "Fan" &&
      !["TcAg", "TcAs", "HF+"].includes(sensorModel)
    ) {
      setSensorModel("HF+");
    }
  }, [machineType]);

  const handleSubmit = () => {
    if (!selectedMachineId) {
      alert("Please select a machine!");
      return;
    }

    const monitoringPoint: MonitoringPoint = {
      id: Date.now().toString(),
      machineId: selectedMachineId,
      name: pointName,
      sensor: { id: Date.now().toString(), model: sensorModel },
    };

    dispatch(
      addMonitoringPoint({
        machineId: selectedMachineId,
        monitoringPoint,
      }),
    );

    setPointName("");
    setSensorModel("HF+");
    setSelectedMachineId("");
  };

  return (
    <FormContainer>
      <TextField
        select
        label="Select Machine"
        value={selectedMachineId}
        onChange={(e) => setSelectedMachineId(e.target.value)}
      >
        {machines.map((machine) => (
          <MenuItem key={machine.id} value={machine.id}>
            {machine.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Sensor Model"
        value={sensorModel}
        onChange={(e) =>
          setSensorModel(e.target.value as "TcAg" | "TcAs" | "HF+")
        }
      >
        {sensorModels.map((sensor) => (
          <MenuItem key={sensor.value} value={sensor.value}>
            {sensor.label}
          </MenuItem>
        ))}
      </TextField>

      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Add Monitoring Point
      </Button>
    </FormContainer>
  );
};

export default MonitoringPointForm;
