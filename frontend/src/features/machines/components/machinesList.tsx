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
  Card,
  CardHeader,
  Divider,
  Box,
  Typography,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EditMachineModal from "./editMachineModal";
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
    <Card
      variant="outlined"
      sx={{
        flex: 1,
        maxHeight: { md: "500px" },
        overflowY: "auto",
      }}
    >
      <CardHeader
        title="Machines"
        sx={{
          "& .MuiCardHeader-title": { fontWeight: 600, fontSize: "1.5rem" },
        }}
      />
      <Divider />
      <Box sx={{ overflowX: "auto", minHeight: 200 }}>
        {machines.length > 0 ? (
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
                  <TableCell>
                    <Typography fontWeight={600}>Actions</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {machines.map((machine) => (
                  <TableRow key={machine.id} hover>
                    <TableCell>{machine.name}</TableCell>
                    <TableCell>{machine.type}</TableCell>
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleOpen(machine)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => dispatch(deleteMachine(machine.id))}
                        >
                          <DeleteIcon />
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
      {editingMachine && (
        <EditMachineModal
          open={open}
          machine={editingMachine}
          onClose={handleClose}
          onSave={handleSave}
        />
      )}
    </Card>
  );
};

export default MachinesList;
