import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { IMonitoringPointsState } from "../../redux/store/monitoringPoints/types";
import { FetchStatus } from "../../redux/types";
import Loading from "../../shared/components/loading";
import * as St from "./styles";

export default function MonitoringPoints() {
  const monitoringPoints: IMonitoringPointsState = useSelector(
    (state: RootState) => state.monitoringPoints,
  );

  return (
    <St.Container>
      {monitoringPoints.status === FetchStatus.loading && <Loading />}
    </St.Container>
  );
}
