import useAuth from './useAuth';
import MachineCard from './MachineCard';
import { useGetMachinesQuery } from './features/monitor/monitorSlice';

export default function ListMachines() {
  const auth = useAuth();
  const { id } = auth!.user;

  const { data, isError, isLoading, isSuccess, refetch, isFetching } =
    useGetMachinesQuery(id);

  return (
    <div className="list">
      <button
        type="button"
        disabled={isLoading || isFetching}
        onClick={() => refetch()}
      >
        Refresh
      </button>
      {isLoading && <Loading />}
      {isError && <ErrorComponent />}
      {isSuccess &&
        data.map((machine, key) => <MachineCard key={key} {...{ machine }} />)}
    </div>
  );
}

export function Loading() {
  return <div>Loading...</div>;
}

export function ErrorComponent() {
  return <div>Error Loading Content...</div>;
}
