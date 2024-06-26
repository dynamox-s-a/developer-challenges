'use client'
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { MachineData } from "@/models/machineModel";
import { machineAndSensorStore, MachineAndSensorType } from "@/contexts/stores/machineAndStore.zustand";

import { SkeletonTable } from '../components/skeleton-table';
import MachineCard from '../components/machine-card';
import { ButtonAddMachine } from '../components/button-add-machine';

export default function Dashboard() {

  const [clientMachineData, setClientMachineData] = useState<MachineData[]>([]);

  const [loading, setLoading] = useState(false); 

  const machines = machineAndSensorStore((state: MachineAndSensorType) => state.machines);
  const setMachines = machineAndSensorStore((state: MachineAndSensorType) => state.setMachines);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      
      setLoading(false);
    }, 2000);
  }, [machines]);

  console.log("machines", machines);


  const hasMachineData = clientMachineData !== null;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between lg:justify-start gap-4">
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
                createdAt={machine.createdAt} sensors={undefined} map={undefined} machine_id={machine.machine_id} user_id={0} updatedAt={''} />
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
