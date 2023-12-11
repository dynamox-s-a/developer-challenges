import Fan from "@assets/fan.png";
import Pump from "@assets/pump.png";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Pagination from "@mui/material/Pagination";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { Tooltip } from "@mui/material";
import { AppDispatch, RootState } from "../../redux/store";
import { getMachines } from "../../redux/store/machines/builders/getMachinesAsync";
import {
  IMachine,
  IMachinesState,
  MachineTypes,
} from "../../redux/store/machines/types";
import { FetchStatus } from "../../redux/types";
import Loading from "../../shared/components/loading";
import ModalMachines from "./modal";

import * as St from "./styles";

interface IMachineProps {
  isMobile: boolean;
}
export default function Machines({ isMobile }: IMachineProps) {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const formHook = useForm<IMachine>();
  const [machineId, setMachineId] = useState<number | undefined>();
  const [modalType, setModalType] = useState<string>("edit");
  const dispatch = useDispatch<AppDispatch>();
  const [page, setPage] = useState<number>(1);
  const { machines, total, status }: IMachinesState = useSelector(
    (state: RootState) => state.machines,
  );

  const openModal = (type: string, mach?: IMachine) => {
    if (type === "edit" && mach) {
      formHook.setValue("name", mach.name);
      formHook.setValue("type", mach.type);
    }
    setModalIsOpen(true);
    setModalType(type);
    mach && setMachineId(mach.id);
  };

  const limit = isMobile ? 5 : 6;

  useMemo(() => {
    dispatch(getMachines({ page, limit }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, limit, page, total]);

  const cardMachines = machines.map((mach) => {
    return (
      <Card sx={{ height: "fit-content" }} key={mach.id}>
        <CardHeader
          sx={{ padding: "0.8rem 1.5rem" }}
          avatar={
            <St.Avatar src={mach.type === MachineTypes.pump ? Pump : Fan} />
          }
          action={
            <St.Actions>
              <IconButton
                onClick={() => openModal("edit", mach)}
                aria-label="settings"
              >
                <EditIcon />
              </IconButton>
              <IconButton
                onClick={() => openModal("delete", mach)}
                aria-label="settings"
              >
                <DeleteIcon />
              </IconButton>
            </St.Actions>
          }
          title={mach.name}
          subheader={`Tipo:${
            mach.type === MachineTypes.pump ? "Bomba" : "Ventilador"
          }`}
        />
      </Card>
    );
  });

  return (
    <St.Container>
      <St.Title>MÁQUINAS</St.Title>
      {status === FetchStatus.loading ? (
        <Loading />
      ) : (
        <St.Machines>{cardMachines}</St.Machines>
      )}

      {total > 0 && total > limit && (
        <Pagination
          sx={{ width: "fit-content", position: "absolute", bottom: 0 }}
          onChange={(_, newPage) => setPage(newPage)}
          page={page}
          count={Math.ceil(total / limit)}
          color="primary"
        />
      )}
      <ModalMachines
        isOpen={modalIsOpen}
        setOpen={setModalIsOpen}
        modalType={modalType}
        machineId={machineId}
        formHook={formHook}
      />
      <Tooltip title="Adicionar Máquina">
        <Fab
          size="large"
          sx={{ position: "absolute", bottom: 0, right: 16 }}
          color="primary"
          aria-label="Adicionar Máquina"
          onClick={() => openModal("create")}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
    </St.Container>
  );
}
