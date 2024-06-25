import { create } from 'zustand'

import { MachineData } from "@/models/machineModel";
import { SensorData } from "@/models/sensorModel";

export interface MachineAndSensorType {
  machines: MachineData[];
  sensors: SensorData[];
  setMachines: (machines: MachineData[]) => void;
  addMachine: (machine: MachineData) => void;
  updateMachine: (machine_id: number, update: Partial<MachineData>) => void;
  removeMachine: (machine_id: number) => void;
  setSensors: (sensors: SensorData[]) => void;
  addSensor: (sensor: SensorData) => void;
  updateSensor: (sensor_id: number, update: Partial<SensorData>) => void;
  removeSensor: (sensor_id: number) => void;
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
}));