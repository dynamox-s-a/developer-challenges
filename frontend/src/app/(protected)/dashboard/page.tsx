'use client'
import React, { useEffect, useState } from 'react';
import { machineData } from '../../../actions/fetchMachineData';
import { Button } from "@/components/ui/button";
import { sensorData } from "@/actions/fetchSensorData";
import { MachineData } from "@/models/machineModel";
import { SensorData } from "@/models/sensorModel";
import { SessionDataType } from '@/models/userModel';
import { machineAndSensorStore, MachineAndSensorType } from "@/contexts/stores/machineAndStore.zustand";
import { getSessionData } from '@/actions/getSessionData';
import { ClipLoader } from 'react-spinners'; // Example of a loader from 'react-spinners'
import { DashboardTable } from '../components/dashboard-table';

export default function Dashboard() {
  const [session, setSession] = useState<SessionDataType | null>(null);
  const [clientMachineData, setClientMachineData] = useState<MachineData[]>([]);
  const [clientSensorData, setClientSensorData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true); // Loading state

  const machines = machineAndSensorStore((state: MachineAndSensorType) => state.machines);
  const sensors = machineAndSensorStore((state: MachineAndSensorType) => state.sensors);
  const setMachines = machineAndSensorStore((state: MachineAndSensorType) => state.setMachines);
  const setSensors = machineAndSensorStore((state: MachineAndSensorType) => state.setSensors);

  useEffect(() => {
    const fetchData = async () => {
      const sessionData = await getSessionData();
      setSession(sessionData as SessionDataType);
  
      if (sessionData) {
        const machines = await machineData(sessionData.user.id, sessionData.accessToken);
        setClientMachineData(machines);
        setMachines(machines);
  
        if (machines.length > 0) {
          const sensorsPromises = machines.map((machine: { machine_id: number; }) =>
            sensorData(machine.machine_id, sessionData.accessToken)
          );
          const sensorsResults = await Promise.all(sensorsPromises);
          const allSensors = sensorsResults.flat();
          setClientSensorData(allSensors);
          setSensors(allSensors);
        }
      }

      setLoading(false); // Set loading to false after data is fetched
    };
  
    fetchData();
  }, [setMachines, setSensors]);

  console.log("machines", machines);
  console.log("sensors", sensors);

  const hasMachineData = clientMachineData !== null;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <ClipLoader size={100} color={"#6A2747"} loading={loading} />
        </div>
      ) : hasMachineData ? (
        
        <DashboardTable />
        
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
