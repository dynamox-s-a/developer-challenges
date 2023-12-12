import { useDispatch } from "react-redux";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { IMachine, NewMachine } from "../../redux/store/machines/types";
import { deleteMachine } from "../../redux/store/machines/builders/deleteMachineAsync";
import { AppDispatch } from "../../redux/store";
import { SetStateFunction } from "../../types";
import { updateMachine } from "../../redux/store/machines/builders/updateMachineAsync";
import { createMachine } from "../../redux/store/machines/builders/createMachineAsync";
import MachineForm from "./form";

interface IModalMachineProps {
  modalType: string;
  isOpen: boolean;
  delMessage?: string | undefined;
  setOpen: SetStateFunction<boolean>;
  id: number | undefined;
  formHook: UseFormReturn;
  delFunction: () => void;
  children: ReactNode;
}

export default function Modal({
  isOpen,
  setOpen,
  modalType,
  id,
  formHook,
  delFunction,
  delMessage,
  children,
}: IModalMachineProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { reset } = formHook;

  const closeModal = () => {
    setOpen(false);
    reset();
  };

  const delMachine = () => {
    id && dispatch(delFunction(id));
    closeModal();
  };

  return (
    <Dialog open={isOpen} onClose={() => closeModal}>
      <DialogTitle id="dialog-title">
        {modalType === "delete"
          ? "Você tem certeza?"
          : `${modalType === "edit" ? "Editar" : "Criar"} Máquina`}
      </DialogTitle>
      <DialogContent>
        {modalType === "delete" && delMessage ? { delMessage } : { children }}
      </DialogContent>

      <DialogActions>
        <Button variant="text" onClick={() => closeModal()}>
          Cancelar
        </Button>
        {modalType === "delete" && (
          <Button variant="contained" onClick={delMachine}>
            Excluir
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
