import { useDispatch, useSelector } from "react-redux";
import { useMemo, useLayoutEffect } from "react";
import { AppDispatch, RootState } from "../../redux/store";
import { FetchStatus } from "../../redux/types";
import Loading from "../../shared/components/loading";
import * as St from "../../pages/Home/styles";
import { ICreateFormPoint, IListPoint, IMonitoringPointsState } from "../../redux/store/monitoringPoints/types";
import { getMonitoringPoints } from "../../redux/store/monitoringPoints/builders/getMonitoringPointsAsync";
import { getListPoints } from "../../redux/store/monitoringPoints/builders/listPointsAsync";
import PointsTable from "./table";
import { UseFormReturn, useForm } from "react-hook-form";

export default function MonitoringPoints() {
  const dispatch = useDispatch<AppDispatch>();
  const createFormHook = useForm<UseFormReturn<ICreateFormPoint>>();
  const editFormHook = useForm<UseFormReturn<IListPoint>>();

  const { monitoringPoints, listPoints, status }: IMonitoringPointsState =
    useSelector((state: RootState) => state.monitoringPoints);

  useLayoutEffect(() => {
    dispatch(getListPoints());
  }, [dispatch]);

  useLayoutEffect(() => {
    dispatch(getMonitoringPoints());
  }, [listPoints]);
  
 

  return (
    <St.ComponentContainer>
      <St.Title>PONTOS DE MONITORAMENTO</St.Title>
      {status === FetchStatus.loading ? (
        <Loading />
      ) : (
        <PointsTable
          machinesPoints={monitoringPoints}
          listPoints={listPoints}
          editFormHook={editFormHook}
          createFormHook={createFormHook}
        />
      )}
    </St.ComponentContainer>
  );
}
