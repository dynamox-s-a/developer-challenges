import { Container, Div, Name } from "./styles.tsx";
import { CustomButton } from "../Button/CustomButton.tsx";
import { IMachine } from "../../pages/Machine/IMachine.ts";

type machineList = {
  machine: IMachine;
  onDelete: (id) => void;
  onEdit: (machine: IMachine) => void;
};

export function ListItem({ machine, onDelete, onEdit }: machineList) {
  return (
    <Container>
      <Name>{machine.name}</Name>
      <Name>{machine.type}</Name>
      <Div>
        <CustomButton title="Editar" onClick={() => onEdit(machine)} />
        <CustomButton
          title="Excluir"
          onClick={() => onDelete(machine._id)}
          $delete
        />
      </Div>
    </Container>
  );
}
