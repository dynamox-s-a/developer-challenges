'use client'
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { machineAndSensorStore, MachineAndSensorType } from "@/contexts/stores/machineAndStore.zustand";

import { SkeletonTable } from '../components/skeleton-table';
import { ButtonAddMonitor } from '../components/button-add-monitor';
import { MonitorsTable } from '../components/monitors-table';
import { SessionDataType } from '@/models/userModel';
import { getSessionData } from '@/actions/getSessionData';
import { machineDataFetch } from '@/actions/fetchMachineData';
import { monitorsData } from '@/actions/fetchMonitorData';
import { sensorData } from '@/actions/fetchSensorData';
import { MachineDataArray } from '@/lib/filter-function';

export default function MonitorPage() {
  const [session, setSession] = useState<SessionDataType | null>(null);
  const [clientValidMachines, setClientValidMachines] = useState<MachineDataArray>([]);
  const [loading, setLoading] = useState(true);

  const monitorsGlobal = machineAndSensorStore((state: MachineAndSensorType) => state.monitors);
  const setMachineGlobal = machineAndSensorStore((state: MachineAndSensorType) => state.setMachines);
  const machineArrayGlobal = machineAndSensorStore((state: MachineAndSensorType) => state.machineArray);
  const setMachineArrayGlobal = machineAndSensorStore((state: MachineAndSensorType) => state.setMachineArray);
  const sensorsGlobal = machineAndSensorStore((state: MachineAndSensorType) => state.sensors);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionData = await getSessionData();
        setSession(sessionData as SessionDataType);
        
        if (sessionData) {
          try {
            const machines = await machineDataFetch(sessionData.user.id, sessionData.accessToken);
            setMachineGlobal(machines);
            const machinesWithMonitors = (await Promise.all(
              machines.map(async (machine: { machine_id: number; }) => {
                try {
                  const monitors = await monitorsData(machine.machine_id, sessionData.accessToken);
                  if (monitors.length > 0) {
                    return { ...machine, monitors };
                  }
                } catch (error) {
                  console.error("Error fetching monitors data", error);
                }
                return null;
              })
            )).filter(machine => machine !== null);

  
            const machinesWithSensors = await Promise.all(machinesWithMonitors.map(async (machine) => {
              const monitorsWithSensors = await Promise.all(machine.monitors.map(async (monitor: { monitoring_point_id: number; }) => {
                try {
                  const sensors = await sensorData(monitor.monitoring_point_id, sessionData.accessToken);
                  return { ...monitor, sensors };
                } catch (error) {
                  console.error("Error fetching sensors data", error);
                  return { ...monitor, sensors: [] }; 
                }
              }));
  
              return { ...machine, monitors: monitorsWithSensors };
            }));
  
            const validMachines = machinesWithSensors.filter(machine => machine.monitors.length > 0);

  
            setClientValidMachines(validMachines as MachineDataArray);
            setMachineArrayGlobal(validMachines);
    
          } catch (error) {
            console.error("Error in machines or monitors or sensors data fetching", error);
          }
        }
      } catch (error) {
        console.error("Error fetching session data", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [monitorsGlobal, sensorsGlobal]);
  
  console.log("machineArrayGlobal", machineArrayGlobal);

  const hasMonitorData = machineArrayGlobal !== undefined && machineArrayGlobal.length > 0;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between lg:justify-start gap-4 z-10">
        <h1 className="text-lg font-semibold md:text-2xl">Pontos de monitoramento</h1>
        
      </div>
      {loading ? (
        <div className="flex flex-1 items-start justify-start">
          <SkeletonTable />
        </div>
      ) : hasMonitorData ? (
        <div>
          <div className='flex gap-4 w-full flex-wrap'>
            <MonitorsTable validatedMachines={machineArrayGlobal} /> 
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
