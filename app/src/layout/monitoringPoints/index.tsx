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
import { AppDispatch, RootState } from "../../redux/store";
import { FetchStatus } from "../../redux/types";
import Loading from "../../shared/components/loading";
import * as St from "../../pages/Home/styles";
import {
  IListPoint,
  IMonitoringPointsState,
} from "../../redux/store/monitoringPoints/types";
import { getMonitoringPoints } from "../../redux/store/monitoringPoints/builders/getMonitoringPointsAsync";
import { getListPoints } from "../../redux/store/monitoringPoints/builders/listPointsAsync";
import PointsTable from "./table";

interface IPointProps {
  isMobile: boolean;
}

export default function MonitoringPoints({ isMobile }: IPointProps) {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const formHook = useForm<IListPoint>();
  const [monitoringPointId, setMonitoringPointId] = useState<
    number | undefined
  >();
  const [modalType, setModalType] = useState<string>("edit");
  const dispatch = useDispatch<AppDispatch>();

  const { monitoringPoints, listPoints, status }: IMonitoringPointsState =
    useSelector((state: RootState) => state.monitoringPoints);

  useMemo(() => {
    dispatch(getMonitoringPoints());
    dispatch(getListPoints());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <St.ComponentContainer>
      <St.Title>PONTOS DE MONITORAMENTO</St.Title>
      {status === FetchStatus.loading ? (
        <Loading />
      ) : (
        <PointsTable
          machinesPoints={monitoringPoints}
          listPoints={listPoints}
        />
      )}
    </St.ComponentContainer>
  );
}
