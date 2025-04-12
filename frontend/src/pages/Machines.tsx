import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
} from "@mui/material";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  getMachines,
  createMachine,
  updateMachine,
  deleteMachine,
  Machine,
  MachineType,
} from "../services/api";
import MachineTable from "../components/MachineTable";
import EditMachineDialog from "../components/EditMachineDialog";
import DeleteMachineDialog from "../components/DeleteMachineDialog";

export default function Machines() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentMachine, setCurrentMachine] = useState<Machine | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: MachineType.Pump,
  });

  const fetchMachines = async () => {
    try {
      setLoading(true);
      const data = await getMachines();
      setMachines(data);
    } catch (error) {
      console.error("Failed to fetch machines:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  const handleOpenDialog = (machine?: Machine) => {
    if (machine) {
      setCurrentMachine(machine);
      setFormData({
        name: machine.name,
        type: machine.type as MachineType,
      });
    } else {
      setCurrentMachine(null);
      setFormData({
        name: "",
        type: MachineType.Pump,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDeleteDialog = (machine: Machine) => {
    setCurrentMachine(machine);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as string]: value,
    });
  };

  const handleSelectChange = (e: SelectChangeEvent<MachineType>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as string]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      if (currentMachine) {
        await updateMachine(
          currentMachine.id,
          formData.name,
          formData.type as MachineType,
        );
        toast.success("Machine updated successfully");
      } else {
        await createMachine(formData.name, formData.type as MachineType);
        toast.success("Machine created successfully");
      }
      handleCloseDialog();
      fetchMachines();
    } catch (error) {
      console.error("Error saving machine:", error);
    }
  };

  const handleDelete = async () => {
    try {
      if (currentMachine) {
        await deleteMachine(currentMachine.id);
        toast.success("Machine deleted successfully");
        handleCloseDeleteDialog();
        fetchMachines();
      }
    } catch (error) {
      console.error("Error deleting machine:", error);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Máquinas
        </Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={() => handleOpenDialog()}
        >
          Adicionar Máquina
        </Button>
      </Box>

      <MachineTable
        machines={machines}
        loading={loading}
        onEdit={handleOpenDialog}
        onDelete={handleOpenDeleteDialog}
      />

      <EditMachineDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        formData={formData}
        onFormChange={handleFormChange}
        onSelectChange={handleSelectChange}
        isEditing={!!currentMachine}
      />

      <DeleteMachineDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        onDelete={handleDelete}
        machineName={currentMachine?.name || null}
      />
    </Box>
  );
}
