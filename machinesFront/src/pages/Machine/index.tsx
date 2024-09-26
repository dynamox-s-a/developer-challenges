import { ListItem } from "../../components/ListItem";
import { useEffect, useState } from "react";
import { IMachine } from "./IMachine.ts";
import { Container, ListContainer, ListHeaderContainer } from "./styles.ts";
import { MachineForm } from "./MachineForm";
import {
  deleteMachine,
  getAllMachines,
} from "../../services/machineService.ts";
import { CustomButton } from "../../components/Button/CustomButton.tsx";

export function Machine() {
  const [machines, setMachines] = useState<IMachine[]>([]);

  const [novo, setNovo] = useState(false);
  const [editMachine, setEditMachine] = useState<IMachine>();
  async function handleDelete(id: string) {
    try {
      await deleteMachine(id).then(() => getMachines());
    } catch (e) {
      console.error("Erro ao deletar maquina");
    }
  }

  function handleNew() {
    setEditMachine(undefined);
    setNovo((prevState) => !prevState);
  }

  async function getMachines() {
    const { resultData } = await getAllMachines({
      sort: {
        orderBy: "name",
        order: "desc",
      },
    });
    setMachines(resultData);
  }

  async function handleEdit(machine: IMachine) {
    setEditMachine((prevState) => machine);

    setNovo(true);
  }

  useEffect(() => {
    getMachines();
  }, [novo]);

  return (
    <Container>
      {novo ? (
        <MachineForm onBack={handleNew} editMachine={editMachine} />
      ) : (
        <ListContainer>
          <CustomButton title="+ Nova" onClick={handleNew} />
          <h2>Machinas</h2>
          <ListHeaderContainer>
            <p>Nome</p>
            <p>Tipo</p>
            <p></p>
            <p></p>
          </ListHeaderContainer>
          {machines.map((item: IMachine, index) => (
            <ListItem
              key={index}
              machine={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </ListContainer>
      )}
    </Container>
  );
}
