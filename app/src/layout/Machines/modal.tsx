import DialogContentText from "@mui/material/DialogContentText";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { deleteMachine } from "../../redux/store/machines/builders/deleteMachineAsync";
import { IMachine } from "../../redux/store/machines/types";
import ModalDialog from "../../shared/components/modal";
import { SetStateFunction } from "../../types";

interface IModalMachineProps {
  type: string;
  isOpen: boolean;
  setOpen: SetStateFunction<boolean>;
  machine: IMachine;
  getFunction: () => void;
}
export default function ModalMachines({
  isOpen,
  setOpen,
  type,
  machine,
  getFunction,
}: IModalMachineProps) {
  const dispatch = useDispatch<AppDispatch>();

  const modalButton = () => {
    type === "edit"
      ? console.log(machine.id)
      : dispatch(deleteMachine(machine.id));
    getFunction();
    setOpen(false);
  };

  return (
    <ModalDialog
      open={isOpen}
      setOpen={setOpen}
      title={type === "edit" ? "Editar Máquina" : "Você tem certeza?"}
      button={() => modalButton()}
    >
      {type === "edit" && (
        <DialogContentText id="dialog-description">
          <p>Formulário</p>
        </DialogContentText>
      )}
    </ModalDialog>
  );
}
