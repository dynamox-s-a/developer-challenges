import { Container, Div, Name } from "./styles.tsx";
import { CustomButton } from "../Button/CustomButton.tsx";
import { IMachine } from "../../pages/Machine/IMachine.ts";
import {ISensor} from "../../pages/Sensor/ISensor.ts";

type itemList = {
  item: IMachine | ISensor;
  onDelete: (id) => void;
  onEdit: (item: IMachine | ISensor) => void;
};

export function ListItem({ item, onDelete, onEdit }: itemList) {
  return (
    <Container>
      <Name>{item.name}</Name>
      <Name>{item.type ? item.type : item.model}</Name>
      <Div>
        <CustomButton title="Editar" onClick={() => onEdit(item)} />
        <CustomButton
          title="Excluir"
          onClick={() => onDelete(item._id)}
          $delete
        />
      </Div>
    </Container>
  );
}
