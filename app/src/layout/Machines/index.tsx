import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { IMachinesState } from "../../redux/store/machines/types";
import { FetchStatus } from "../../redux/types";
import Loading from "../../shared/components/loading";
import * as St from "./styles";

export default function Machines() {
  const machines: IMachinesState = useSelector(
    (state: RootState) => state.machines,
  );

  console.log({ machines });

  return (
    <St.Container>
      {machines.status === FetchStatus.loading && <Loading />}
    </St.Container>
  );
}
