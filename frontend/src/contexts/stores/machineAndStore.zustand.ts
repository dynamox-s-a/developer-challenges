import { create } from 'zustand'

import { MachineData } from "@/models/machineModel";
import { SensorData } from "@/models/sensorModel";
import { MonitorsData } from "@/models/monitorsModel";
import { MachineDataArray } from '@/lib/filter-function';

export interface MachineAndSensorType {
  machines: MachineData[];
  sensors: SensorData[];
  monitors: MonitorsData[];
  setMachines: (machines: MachineData[]) => void;
  addMachine: (machine: MachineData) => void;
  updateMachine: (machine_id: number, update: Partial<MachineData>) => void;
  removeMachine: (machine_id: number) => void;
  setSensors: (sensors: SensorData[]) => void;
  addSensor: (sensor: SensorData) => void;
  updateSensor: (sensor_id: number, update: Partial<SensorData>) => void;
  removeSensor: (sensor_id: number) => void;
  setMonitors: (monitors: MonitorsData[]) => void;
  addMonitor: (monitor: MonitorsData) => void;
  updateMonitor: (monitor_id: number, update: Partial<MonitorsData>) => void;
  removeMonitor: (monitor_id: number) => void;
  setMachineArray: (machineArray: MachineDataArray) => void;
  machineArray: MachineDataArray; 
}

export const machineAndSensorStore = create<MachineAndSensorType>((set) => ({
  machines: [],
  setMachines: (machines: MachineData[]) => set({ machines }),
  addMachine: (machine: MachineData) => set((state) => ({ machines: [...state.machines, machine] })),
  updateMachine: (machine_id: number, update: Partial<MachineData>) => set((state) => ({
    machines: state.machines.map((m) => m.machine_id === machine_id ? { ...m, ...update } : m),
  })),
  removeMachine: (machine_id: number) => set((state) => ({
    machines: state.machines.filter((m) => m.machine_id !== machine_id),
  })),
  sensors: [],
  setSensors: (sensors: SensorData[]) => set({ sensors }),
  addSensor: (sensor: SensorData) => set((state) => ({ sensors: [...state.sensors, sensor] })),
  updateSensor: (sensor_id: number, update: Partial<SensorData>) => set((state) => ({
    sensors: state.sensors.map((s) => s.sensor_id === sensor_id ? { ...s, ...update } : s),
  })),
  removeSensor: (sensor_id: number) => set((state) => ({
    sensors: state.sensors.filter((s) => s.sensor_id !== sensor_id),
  })),
  monitors: [],
  setMonitors: (monitors: MonitorsData[]) => set({ monitors }),
  addMonitor: (monitor: MonitorsData) => set((state) => ({ monitors: [...state.monitors, monitor] })),
  updateMonitor: (monitoring_point_id: number, update: Partial<MonitorsData>) => set((state) => ({
    monitors: state.monitors.map((m) => m.monitoring_point_id === monitoring_point_id ? { ...m, ...update } : m),
  })),
  removeMonitor: (monitoring_point_id: number) => set((state) => ({
    monitors: state.monitors.filter((m) => m.monitoring_point_id !== monitoring_point_id),
  })),
  machineArray : [],
  setMachineArray: (machineArray: MachineDataArray) => set({ machineArray }),
}));