'use client'
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { MachineData } from "@/models/machineModel";
import { machineAndSensorStore, MachineAndSensorType } from "@/contexts/stores/machineAndStore.zustand";

import { SkeletonTable } from '../components/skeleton-table';
import MachineCard from '../components/machine-card';
import { ButtonAddMachine } from '../components/button-add-machine';
import { getSessionData } from '@/actions/getSessionData';
import { SessionDataType } from '@/models/userModel';
import { machineDataFetch } from '@/actions/fetchMachineData';

export default function MachinePage() {

  const [clientMachineData, setClientMachineData] = useState<MachineData[]>([]);
  const [session, setSession] = useState<SessionDataType | null>(null);

  const [loading, setLoading] = useState(false); 

  const machines = machineAndSensorStore((state: MachineAndSensorType) => state.machines);
  const setMachines = machineAndSensorStore((state: MachineAndSensorType) => state.setMachines);

  useEffect(() => {
    const fetchData = async () => {
      const sessionData = await getSessionData();
      setSession(sessionData as SessionDataType);
  
      if (sessionData) {
        const machines = await machineDataFetch(sessionData.user.id, sessionData.accessToken);
        setMachines(machines); 
      }
      setLoading(false); 
    };
  
    fetchData();
  }, [machines]);


  const hasMachineData = clientMachineData !== null;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex w-full items-center justify-between pr-6 ">
        <h1 className="text-lg font-semibold md:text-2xl">Máquinas</h1>
        <ButtonAddMachine />
      </div>
      {loading ? (
        <div className="flex flex-1 items-start justify-start">
          <SkeletonTable />
        </div>
      ) : hasMachineData ? (
        <div>
          <div className='flex gap-4 w-full flex-wrap'>
            {machines.map((machine, index) => (
              <MachineCard
                key={index}
                machine_type={machine.machine_type}
                machine_name={machine.machine_name}
                createdAt={machine.createdAt} map={undefined} machine_id={machine.machine_id} user_id={0} updatedAt={''} monitors={[]} />
            ))}
          </div>
        </div>

      ) : (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
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
