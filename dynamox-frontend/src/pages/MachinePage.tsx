import MachineList from "../components/MachineList";
import MachineForm from "../components/MachineForm";
import { Container } from "@mui/material";

const MachinePage = () => {
  return (
    <Container>
      <h2>Gestão de Máquinas</h2>
      <MachineForm />
      <MachineList />
    </Container>
  );
};

export default MachinePage;
