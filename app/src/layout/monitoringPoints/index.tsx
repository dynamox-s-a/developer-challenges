import { useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";
import { AppDispatch, RootState } from "../../redux/store";
import { FetchStatus } from "../../redux/types";
import Loading from "../../shared/components/loading";
import * as St from "../../pages/Home/styles";
import { IMonitoringPointsState } from "../../redux/store/monitoringPoints/types";
import { getMonitoringPoints } from "../../redux/store/monitoringPoints/builders/getMonitoringPointsAsync";
import { getListPoints } from "../../redux/store/monitoringPoints/builders/listPointsAsync";
import PointsTable from "./table";

export default function MonitoringPoints() {
  const dispatch = useDispatch<AppDispatch>();

  const { monitoringPoints, listPoints, status }: IMonitoringPointsState =
    useSelector((state: RootState) => state.monitoringPoints);

  useMemo(() => {
    dispatch(getMonitoringPoints());
    dispatch(getListPoints());
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
