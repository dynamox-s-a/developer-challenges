'use client'
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { MonitorsData } from "@/models/monitorsModel";
import { machineAndSensorStore, MachineAndSensorType } from "@/contexts/stores/machineAndStore.zustand";

import { SkeletonTable } from '../components/skeleton-table';
import { ButtonAddMonitor } from '../components/button-add-monitor';
import { MonitorsTable } from '../components/monitors-table';

export default function MonitorPage() {

  const [clientMonitorData, setClientMonitorData] = useState<MonitorsData[]>([]);

  const [loading, setLoading] = useState(false);

  const monitorsGlobalState = machineAndSensorStore((state) => state.monitors);
  const addMonitorToGLobalState = machineAndSensorStore((state) => state.addMonitor);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {

      setLoading(false);
    }, 2000);
  }, [monitorsGlobalState]);




  const hasMonitorData = clientMonitorData !== null;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between lg:justify-start gap-4">
        <h1 className="text-lg font-semibold md:text-2xl">Pontos de monitoramento</h1>
        <ButtonAddMonitor />
      </div>
      {loading ? (
        <div className="flex flex-1 items-start justify-start">
          <SkeletonTable />
        </div>
      ) : hasMonitorData ? (
        <div>
          <div className='flex gap-4 w-full flex-wrap'>
            <MonitorsTable machineData={clientMonitorData} sensorData={clientMonitorData} />
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
