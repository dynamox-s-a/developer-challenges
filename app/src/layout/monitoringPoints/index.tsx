import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { IMonitoringPointsState } from "../../redux/store/monitoringPoints/types";
import { FetchStatus } from "../../redux/types";
import Loading from "../../shared/components/loading";
import * as St from "./styles";

export default function MonitoringPoints() {
  const machines: IMonitoringPointsState = useSelector(
    (state: RootState) => state.monitoringPoints,
  );

  console.log({ machines });

  return (
    <St.Container>
      {machines.status === FetchStatus.loading && <Loading />}
    </St.Container>
  );
}
