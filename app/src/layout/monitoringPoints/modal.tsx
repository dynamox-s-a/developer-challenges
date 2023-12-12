import { useDispatch } from "react-redux";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { IListPoint, NewPoint } from "../../redux/store/monitoringPoints/types";
import { deleteMonitoringPoint } from "../../redux/store/monitoringPoints/builders/deleteMonitoringPointsAsync";
import { AppDispatch } from "../../redux/store";
import { SetStateFunction } from "../../types";
import { updateMonitoringPoint } from "../../redux/store/monitoringPoints/builders/updateMonitoringPointsAsync";
import { createMonitoringPoint } from "../../redux/store/monitoringPoints/builders/createMonitoringPointsAsync";
import EditPointForm from "./form";
import { useEffect, useState } from "react";
import { IMachine } from "../../redux/store/machines/types";
import { MachinesService } from "../../services/api/machines/MachinesSrevice";

interface IModalPointsProps {
  modalType: string;
  isOpen: boolean;
  setOpen: SetStateFunction<boolean>;
  pointId: number | undefined;
  formHook: UseFormReturn<IListPoint>;
}

export default function ModalPoints({
  isOpen,
  setOpen,
  modalType,
  pointId,
  formHook,
}: IModalPointsProps) {
  const [selectedMachine, setSelectedMachine] = useState<IMachine>()
  const [machines, setMachines] = useState<IMachine[]>([]);

  const fetchData = async () => {
    const response = await MachinesService.getAll();
    return response.data;
  };

  useEffect(() => {
    fetchData().then((data) => {
      setMachines(data);
      const machinePointId = formHook.getValues("machineId")

      const mach: IMachine = data.filter((mach: IMachine) => mach.id === machinePointId)[0]
      setSelectedMachine(mach);
    }).catch((err) => console.log(err))
  }, []);

  const dispatch = useDispatch<AppDispatch>();
  const { reset } = formHook;

  const closeModal = () => {
    setOpen(false);
    reset();
  };

  const delPoint = () => {
    pointId && dispatch(deleteMonitoringPoint(pointId));
    closeModal();
  };

  const createOrUpdatePoint: SubmitHandler<IListPoint | NewPoint> = async ({
    name,
    sensor,
    machineId
  }) => {
    closeModal();
    if (modalType === "edit" && pointId) {
      const newPoint = {
        id: pointId,
        machineId,
        name,
        sensor,
      };
      return await dispatch(updateMonitoringPoint(newPoint));
    }

    if (modalType === "create")
      return await dispatch(createMonitoringPoint({ name, sensor, machineId }));
  };

  return (
    <Dialog open={isOpen} onClose={() => closeModal}>
      <DialogTitle id="dialog-title">
        {modalType === "delete"
          ? "Você tem certeza?"
          : `${modalType === "edit" ? "Editar" : "Criar"} Ponto de Monitoramento`}
      </DialogTitle>
      <DialogContent>
        {modalType === "delete" ? (
          <p>Essa operação não poderá ser desfeita </p>
        ) : (
          selectedMachine && <EditPointForm formHook={formHook} formSubmit={createOrUpdatePoint} selectedMachine={selectedMachine}/>
        )}
      </DialogContent>

      <DialogActions>
        <Button variant="text" onClick={() => closeModal()}>
          Cancelar
        </Button>
        {modalType === "delete" && (
          <Button variant="contained" onClick={delPoint}>
            Excluir
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
