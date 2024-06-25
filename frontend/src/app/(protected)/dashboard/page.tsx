
import { auth } from "../../../../auth"
import { Button } from "@/components/ui/button";
import { machineData } from '../../../actions/fetchMachineData'

interface MachineData {
  machine_id: number;
  user_id: number;
  machine_type: string;
  machine_name: string;
  createdAt: string;
  updatedAt: string;
}

export default async function Admin() {
  const session = await auth()
  const clientMachineData: MachineData[] = await machineData(session?.user.id ?? '', session?.accessToken ?? '')
  const hasMachineData = clientMachineData !== null;


  return (


    //TODO: Implementar a lógica de o cadastro e a verificação de máquinas cadastradas


    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      {hasMachineData ? (
        clientMachineData.map((data) => (
          <p key={data.machine_id}>{data.machine_name}</p>
        ))
      ) : (

        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm" x-chunk="dashboard-02-chunk-1">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">Você ainda não cadastrou máquinas</h3>
            <p className="text-sm text-muted-foreground">Cadastre sua primeira máquina para adicionar sensores e pontos de monitoramento</p>
            <Button className="mt-4">Cadastrar Máquina</Button>
          </div>
        </div>
      )}
    </main>
  );
}
