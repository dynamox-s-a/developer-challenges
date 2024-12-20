"use client";
import React, { useState } from "react";
import {
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
  TextField,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Toolbar,
} from "@mui/material";
import { Pencil, Trash } from "@phosphor-icons/react/dist/ssr";
import { useAppSelector } from "@/types/hooks";
import { Machine } from "@/types/machines";
import { deleteMachine } from "@/redux/machinesSlice";
import { useDispatch } from "react-redux";
import UpdateMachineDialog from "./updateMachineDialog";
import DeleteMachineDialog from "./deleteMachineDialog";

const MachinesList = () => {
  const machines = useAppSelector((state) => state.machines.machines);
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [machineToDelete, setMachineToDelete] = useState<Machine | null>(null);

  /**
   * Opens the modal to update an existing machine.
   * @param {Machine} machine - The machine to be updated.
   */
  const handleOpenModal = (machine: Machine) => {
    setSelectedMachine(machine);
    setIsModalOpen(true);
  };

  /**
   * Closes the modal for updating a machine.
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMachine(null);
  };

  /**
   * Opens the delete confirmation dialog for a machine.
   * @param {Machine} machine - The machine to be deleted.
   */
  const handleOpenDeleteDialog = (machine: Machine) => {
    setMachineToDelete(machine);
    setIsDeleteDialogOpen(true);
  };

  /**
   * Closes the delete confirmation dialog.
   */
  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setMachineToDelete(null);
  };

  /**
   * Deletes the selected machine after confirmation.
   */
  const handleDelete = () => {
    if (machineToDelete) {
      dispatch(deleteMachine(machineToDelete.id));
      handleCloseDeleteDialog();
    }
  };

  // Filter machines based on search query and selected type
  const filteredMachines = machines.filter((machine) => {
    const matchesSearch =
      machine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      machine.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType ? machine.type === selectedType : true;
    return matchesSearch && matchesType;
  });

  return (
    <>
      <Toolbar sx={{ display: "flex", justifyContent: "end", gap: 2 }}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: 200 }}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Machine Type</InputLabel>
          <Select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            label="Machine Type"
            sx={{ width: 200 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Pump">Pump</MenuItem>
            <MenuItem value="Fan">Fan</MenuItem>
          </Select>
        </FormControl>
      </Toolbar>
      
      <Box sx={{ overflowX: "auto", maxHeight: "600px" }}>
        {filteredMachines.length > 0 ? (
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
                {filteredMachines.map((machine) => (
                  <TableRow key={machine.id} hover>
                    <TableCell>
                      <Typography>{machine.name}</Typography>
                    </TableCell>
                    <TableCell>{machine.type}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleOpenModal(machine)}>
                          <Pencil />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => handleOpenDeleteDialog(machine)}
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

        <UpdateMachineDialog
          open={isModalOpen}
          onClose={handleCloseModal}
          machine={selectedMachine}
        />

        <DeleteMachineDialog
          open={isDeleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          machine={machineToDelete}
          onDelete={handleDelete}
        />
      </Box>
    </>
  );
};

export default MachinesList;
