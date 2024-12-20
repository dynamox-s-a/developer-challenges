"use client";
import React, { useState } from "react";
// import { useAppSelector } from "@/store/store";
// import { useDispatch } from "react-redux";
// import { deleteMachine, updateMachine } from "../redux/machinesSlice";
import {
  Grid,
  Card,
  CardHeader,
  Divider,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import { Pencil, Trash } from "@phosphor-icons/react/dist/ssr";
// import EditMachineModal from "./editMachineModal";

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

const mockMachines = [
  {
    id: "1",
    name: "Pump 1",
    type: "Pump",
    monitoringPoints: [
      { id: "mp1", name: "Point A", sensor: { id: "s1", model: "TcAg" } },
      { id: "mp2", name: "Point B", sensor: { id: "s2", model: "TcAs" } },
    ],
  },
  {
    id: "2",
    name: "Fan 1",
    type: "Fan",
    monitoringPoints: [
      { id: "mp3", name: "Point C", sensor: { id: "s3", model: "HF+" } },
    ],
  },
  {
    id: "2",
    name: "Fan 1",
    type: "Fan",
    monitoringPoints: [
      { id: "mp3", name: "Point C", sensor: { id: "s3", model: "HF+" } },
    ],
  },
  {
    id: "2",
    name: "Fan 1",
    type: "Fan",
    monitoringPoints: [
      { id: "mp3", name: "Point C", sensor: { id: "s3", model: "HF+" } },
    ],
  },
  {
    id: "2",
    name: "Fan 1",
    type: "Fan",
    monitoringPoints: [
      { id: "mp3", name: "Point C", sensor: { id: "s3", model: "HF+" } },
    ],
  },
];

const MachinesList = () => {
  // const machines = useAppSelector((state) => state.machines.machines);
  // const dispatch = useDispatch();
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

    // dispatch(
    //   updateMachine({
    //     id,
    //     name,
    //     type,
    //     monitoringPoints: editingMachine.monitoringPoints,
    //   }),
    // );
  };

  return (
    <Card variant="outlined" sx={{ flexGrow: 1 }}>
      <Box sx={{ overflowX: "auto", minHeight: 200 }}>
        {mockMachines.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography fontWeight={600}>Machine Name</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={600}>Machine Type</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontWeight={600}>Actions</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockMachines.map((machine) => (
                  <TableRow key={machine.id} hover>
                    <TableCell>
                      <Typography>{machine.name}</Typography>
                    </TableCell>
                    <TableCell>{machine.type}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton>
                          <Pencil />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                        // dispatch(deleteMachine(machine.id))
                        >
                          <Trash />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ textAlign: "center", p: 2 }}>
            <Typography color="text.secondary">
              No machines available
            </Typography>
          </Box>
        )}
      </Box>
      {/* {editingMachine && (
            <EditMachineModal
              open={open}
              machine={editingMachine}
              onClose={handleClose}
              onSave={handleSave}
            />
          )} */}
    </Card>
  );
};

export default MachinesList;
