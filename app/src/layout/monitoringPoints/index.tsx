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
import { FetchStatus } from "../../redux/types";
import Loading from "../../shared/components/loading";
import * as St from "../../pages/Home/styles";
import {
  ColumnOrder,
  IGetPagination,
  IMonitoringPoint,
  IMonitoringPointsState,
} from "../../redux/store/monitoringPoints/types";
import { getMonitoringPoints } from "../../redux/store/monitoringPoints/builders/getMonitoringPointsAsync";
import PointsTable from "./table";

interface IPointProps {
  isMobile: boolean;
}

export default function MonitoringPoints({ isMobile }: IPointProps) {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const formHook = useForm<IMonitoringPoint>();
  const [monitoringPointId, setMonitoringPointId] = useState<
    number | undefined
  >();
  const [modalType, setModalType] = useState<string>("edit");
  const dispatch = useDispatch<AppDispatch>();
  const [page, setPage] = useState<number>(1);
  const [orderBy, setOrderBy] = useState<string>("machineId");
  const [order, setOrder] = useState<ColumnOrder>(ColumnOrder.desc);

  const { monitoringPoints, total, status }: IMonitoringPointsState =
    useSelector((state: RootState) => state.monitoringPoints);

  console.log({ monitoringPoints });

  useMemo(() => {
    const payload: IGetPagination = {
      pagination: {
        page,
        limit: 5,
      },
      sort: {
        orderBy,
        order,
      },
    };
    dispatch(getMonitoringPoints(payload));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, page, total]);

  return (
    <St.ComponentContainer>
      <St.Title>PONTOS DE MONITORAMENTO</St.Title>
      {status === FetchStatus.loading ? (
        <Loading />
      ) : (
        <St.Machines>
          {isMobile ? (
            <p>Lista</p>
          ) : (
            <PointsTable monitoringPoints={monitoringPoints} total={total} />
          )}
        </St.Machines>
      )}
    </St.ComponentContainer>
  );
}
