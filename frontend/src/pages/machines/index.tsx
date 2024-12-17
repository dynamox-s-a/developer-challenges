import MachineForm from "@/features/machines/components/machinesForm";
import MachineList from "@/features/machines/components/machinesList";
import { Box, Typography } from "@mui/material";

const MachinesPage = () => {
  return (
    <Box>
      <Typography variant="h4" component="h4" gutterBottom>
        Machine Management
      </Typography>
      <Box
        display="flex"
        gap="3rem"
        justifyContent="space-between"
        sx={{ flexDirection: { xs: "column", md: "row" } }}
      >
        <MachineForm />
        <MachineList />
      </Box>
    </Box>
  );
};

export default MachinesPage;
