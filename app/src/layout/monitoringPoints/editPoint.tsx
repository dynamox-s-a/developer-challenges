import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { Button } from "@mui/material";
import {
  IListPoint,
  NewPoint,
} from "../../redux/store/monitoringPoints/types";
import { IMachine, MachineTypes } from "../../redux/store/machines/types";
import * as St from "../../pages/Home/styles";
import PointForm from "./pointForm";

interface IFormMachineProps {
  formHook: UseFormReturn<IListPoint>;
  formSubmit: SubmitHandler<IListPoint | NewPoint>;
  selectedMachine: IMachine
}

export default function EditPointForm({
  formHook,
  formSubmit,
  selectedMachine
}: IFormMachineProps) {
  const { handleSubmit } = formHook;

  return (
    <St.Form autoComplete="off" onSubmit={handleSubmit(formSubmit)}>
      <section>
        <St.MachineName>Máquina: {selectedMachine.name}</St.MachineName>
        <St.MachineType>Tipo: {selectedMachine.type === MachineTypes.pump? "Bomba": "Ventilador"}</St.MachineType>
      </section>
      <PointForm formHook={formHook} selectedMachine={selectedMachine}/>
      <Button type="submit">Salvar</Button>
    </St.Form>
  );
}
