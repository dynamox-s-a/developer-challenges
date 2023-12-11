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
  setOpen: SetStateFunction<boolean>;
  machine: IMachine;
  formHook: UseFormReturn<IMachine>;
}

export default function ModalMachines({
  isOpen,
  setOpen,
  modalType,
  machine,
  formHook,
}: IModalMachineProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { reset } = formHook;

  const closeModal = () => {
    setOpen(false);
    reset();
  };

  const delMachine = () => {
    dispatch(deleteMachine(machine.id));
    closeModal();
  };

  const createOrUpdateMachine: SubmitHandler<IMachine | NewMachine> = async ({
    name,
    type,
  }) => {
    const newMachine = {
      id: machine.id,
      name,
      type,
    };
    closeModal();
    if (modalType === "edit") return await dispatch(updateMachine(newMachine));
    if (modalType === "create")
      return await dispatch(createMachine({ name, type }));
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={isOpen}
      onClose={() => closeModal}
      scroll="paper"
    >
      <DialogTitle id="dialog-title">
        {modalType === "edit" ? "Editar Máquina" : "Você tem certeza?"}
      </DialogTitle>
      <DialogContent dividers>
        {(modalType === "edit" || modalType === "create") && (
          <MachineForm formHook={formHook} formSubmit={createOrUpdateMachine} />
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={() => closeModal()}>Cancelar</Button>
        {modalType === "delete" && (
          <Button onClick={delMachine}>Excluir</Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
