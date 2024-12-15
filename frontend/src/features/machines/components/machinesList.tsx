import React, { useState } from "react";
import { useAppSelector } from "@/store/store";
import { useDispatch } from "react-redux";
import { deleteMachine, updateMachine } from "../redux/machinesSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import styled from "styled-components";
import EditMachineModal from "./editMachineModal";

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

interface Sensor {
  id: string;
  model: "TcAg" | "TcAs" | "HF+";
}

interface MonitoringPoint {
  id: string;
  name: string;
  sensor: Sensor | null;
}

interface Machine {
  id: string;
  name: string;
  type: "Pump" | "Fan";
  monitoringPoints: MonitoringPoint[];
}

const MachinesList = () => {
  const machines = useAppSelector((state) => state.machines.machines);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);

  const handleOpen = (machine: Machine) => {
    setEditingMachine(machine);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingMachine(null);
  };

  const handleSave = (id: string, name: string, type: "Pump" | "Fan") => {
    if (!editingMachine) {
      return;
    }

    dispatch(
      updateMachine({
        id,
        name,
        type,
        monitoringPoints: editingMachine.monitoringPoints,
      }),
    );
  };

  return (
    <ListContainer>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Machine Name</TableCell>
              <TableCell>Machine Type</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {machines.map((machine) => (
              <TableRow key={machine.id}>
                <TableCell>{machine.name}</TableCell>
                <TableCell>{machine.type}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => dispatch(deleteMachine(machine.id))}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton>
                    <EditIcon onClick={() => handleOpen(machine)} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <EditMachineModal
        open={open}
        machine={editingMachine}
        onClose={handleClose}
        onSave={handleSave}
      />
    </ListContainer>
  );
};

export default MachinesList;
