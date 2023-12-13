import { Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { createMachine } from "../../redux/store/machines/builders/createMachineAsync";
import { deleteMachine } from "../../redux/store/machines/builders/deleteMachineAsync";
import { updateMachine } from "../../redux/store/machines/builders/updateMachineAsync";
import { IMachine, NewMachine } from "../../redux/store/machines/types";
import { SetStateFunction } from "../../types";
import MachineForm from "./form";

interface IModalMachineProps {
  modalType: string;
  isOpen: boolean;
  setOpen: SetStateFunction<boolean>;
  machineId: number | undefined;
  formHook: UseFormReturn<IMachine>;
}

export default function ModalMachines({
  isOpen,
  setOpen,
  modalType,
  machineId,
  formHook,
}: IModalMachineProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { reset } = formHook;

  const closeModal = () => {
    setOpen(false);
    reset();
  };

  const delMachine = () => {
    machineId && dispatch(deleteMachine(machineId));
    closeModal();
  };

  const createOrUpdateMachine: SubmitHandler<IMachine | NewMachine> = async ({
    name,
    type,
  }) => {
    closeModal();
    if (modalType === "edit" && machineId) {
      const newMachine = {
        id: machineId,
        name,
        type,
      };
      return await dispatch(updateMachine(newMachine));
    }

    if (modalType === "create")
      return await dispatch(createMachine({ name, type }));
  };

  return (
    <Dialog open={isOpen} onClose={() => closeModal}>
      <DialogTitle id="dialog-title">
        {modalType === "delete"
          ? "Você tem certeza?"
          : `${modalType === "edit" ? "Editar" : "Criar"} Máquina`}
      </DialogTitle>
      <DialogContent>
        {modalType === "delete" ? (
          <p>Isso apagará também os registros dos sensores correspondentes </p>
        ) : (
          <MachineForm formHook={formHook} formSubmit={createOrUpdateMachine} />
        )}
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
