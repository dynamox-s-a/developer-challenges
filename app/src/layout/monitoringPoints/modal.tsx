import { Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect, useState } from "react";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { IMachine } from "../../redux/store/machines/types";
import { createMonitoringPoint } from "../../redux/store/monitoringPoints/builders/createMonitoringPointsAsync";
import { updateMonitoringPoint } from "../../redux/store/monitoringPoints/builders/updateMonitoringPointsAsync";
import {
  ICreateFormPoint,
  IListPoint,
  NewPoint,
} from "../../redux/store/monitoringPoints/types";
import { MachinesService } from "../../services/api/machines/MachinesSrevice";
import { SetStateFunction } from "../../types";
import CreateForm from "./createPoint";
import EditPointForm from "./editPoint";

interface IModalPointsProps {
  modalType: string;
  isOpen: boolean;
  setOpen: SetStateFunction<boolean>;
  pointId: number | undefined;
  editFormHook: UseFormReturn<IListPoint>;
  createFormHook: UseFormReturn<ICreateFormPoint>;
}

export default function ModalPoints({
  isOpen,
  setOpen,
  modalType,
  pointId,
  editFormHook,
  createFormHook,
}: IModalPointsProps) {
  const [selectedMachine, setSelectedMachine] = useState<IMachine>();
  const [machines, setMachines] = useState<IMachine[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  // const reset = modalType === "edit" ? editFormHook.reset : createFormHook.reset

  const fetchData = async () => {
    const response = await MachinesService.getAll();
    return response.data;
  };

  useEffect(() => {
    fetchData()
      .then((data) => {
        setMachines(data);
        const machinePointId = editFormHook.getValues("machineId");

        const mach: IMachine = data.filter(
          (m: IMachine) => m.id === machinePointId,
        )[0];
        setSelectedMachine(mach);
      })
      .catch((err) => console.log(err));
  }, [editFormHook]);

  const closeModal = () => {
    setOpen(false);
    // reset();
  };

  const updatePoint: SubmitHandler<IListPoint> = async ({
    name,
    sensor,
    machineId,
  }) => {
    closeModal();
    if (pointId) {
      const newPoint = {
        id: pointId,
        machineId,
        name,
        sensor,
      };
      return await dispatch(updateMonitoringPoint(newPoint));
    }
  };

  const createPoint: SubmitHandler<ICreateFormPoint> = async ({
    name1,
    sensor1,
    name2,
    sensor2,
    machineId,
  }) => {
    closeModal();

    const firstPoint: NewPoint = {
      machineId,
      name: name1,
      sensor: sensor1,
    };

    const secondPoint: NewPoint = {
      machineId,
      name: name2,
      sensor: sensor2,
    };

    await dispatch(createMonitoringPoint(firstPoint));
    await dispatch(createMonitoringPoint(secondPoint));
    return;
  };

  const modalBody = () => {
    if (modalType === "edit" && selectedMachine)
      return (
        <EditPointForm
          formHook={editFormHook}
          formSubmit={updatePoint}
          selectedMachine={selectedMachine}
        />
      );
    if (modalType === "create" && machines.length)
      return (
        <CreateForm
          formHook={createFormHook}
          formSubmit={createPoint}
          machines={machines}
        />
      );
  };

  return (
    <Dialog open={isOpen} onClose={() => closeModal}>
      <DialogTitle id="dialog-title">
        {`${modalType === "edit" ? "Editar" : "Criar"} Ponto de Monitoramento`}
      </DialogTitle>
      <DialogContent>{modalBody()}</DialogContent>

      <DialogActions>
        <Button variant="text" onClick={() => closeModal()}>
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
