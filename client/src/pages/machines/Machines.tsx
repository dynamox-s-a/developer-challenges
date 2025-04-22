import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { MachineTable } from "../../components/table/MachineTable";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import {
  fetchMachines,
  addMachine,
  editMachine,
  removeMachine,
} from "../../redux/machinesSlice";
import { Machine } from "../../types/machines";
import MachineForm from "../../components/form/MachineForm";

export default function Machines() {
  const dispatch = useAppDispatch();
  const { machines, loading } = useAppSelector((state) => state.machines);

  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);

  useEffect(() => {
    dispatch(fetchMachines());
  }, [dispatch]);

  const handleSubmit = (
    data: { name: string; type: string },
    id?: string
  ) => {
    if (id) {
      dispatch(editMachine({ id, data }));
    } else {
      dispatch(addMachine(data));
    }
  };

  const handleEdit = (machine: Machine) => {
    setEditingMachine(machine);
  };

  const handleDelete = (id: string) => {
    dispatch(removeMachine(id));
  };

  const clearEditing = () => setEditingMachine(null);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: 6,
        gap: 4,
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h3" component="h1" gutterBottom>
        Machine Management
      </Typography>

      <MachineForm
        onSubmit={handleSubmit}
        editingMachine={editingMachine}
        clearEditing={clearEditing}
      />

      {loading ? (
        <CircularProgress />
      ) : (
        <MachineTable
          machines={machines}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </Box>
  );
}
