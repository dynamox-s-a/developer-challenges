import MachineForm from "@/features/machines/components/machinesForm";
import MachineList from "@/features/machines/components/machinesList";
import { Box } from "@mui/material";

const MachinesPage = () => {
  return (
    <Box>
      <h1>Machine Management</h1>
      <MachineForm />
      <MachineList />
    </Box>
  );
};

export default MachinesPage;
