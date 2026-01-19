import { Machine } from "./entity/machine";
import { MonitoringPoint } from "./entity/monitoring-point";

export async function listMachines() {
  try {
    const response = await fetch("http://localhost:3001/machines/");

    if (!response.ok) {
      throw new Error("Falhou em listMachines");
    }

    const result = await response.json();
    return result;
  } catch (error: unknown) {
    console.log('Error no listMachines', error)
    return []
  }
}

export async function createMachine(name: string, type: string) {
  try {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, type: type })
    };

    const response = await fetch("http://localhost:3001/machines/", requestOptions);

    if (!response.ok) {
      throw new Error("Falhou em createMachine");
    }

  } catch (error: unknown) {
    console.log('Error no createMachine', error)
    return
  }
}

export async function updateMachine(machine: Machine) {
  try {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: machine.name, type: machine.type })
    };
    const response = await fetch(`http://localhost:3001/machines/${machine.id}`, requestOptions);

    if (!response.ok) {
      throw new Error("Falhou em updateMachine");
    }

  } catch (error: unknown) {
    console.log('Error no updateMachine', error)
  }
}

export async function deleteMachine(machine: Machine) {
  try {
    const requestOptions = {
      method: 'DELETE'
    };
    const response = await fetch(`http://localhost:3001/machines/${machine.id}`, requestOptions);

    if (!response.ok) {
      throw new Error("Falhou em deleteMachine");
    }

  } catch (error: unknown) {
    console.log('Error no deleteMachine', error)
  }
}


export async function listMonitoringPoints() {
  try {
    const response = await fetch("http://localhost:3001/monitoring-points/");

    if (!response.ok) {
      throw new Error("Falhou em listMonitoringPoints");
    }

    const result = await response.json();
    return result;
  } catch (error: unknown) {
    console.log('Error no listMonitoringPoints', error)
    return []
  }
}

export async function createMonitoringPoint(name: string, type: string, machineId: number) {
  try {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, type, machineId })
    };
    const response = await fetch("http://localhost:3001/monitoring-points/", requestOptions);

    if (!response.ok) {
      throw new Error("Falhou em createMonitoringPoint");
    }

  } catch (error: unknown) {
    console.log('Error no createMonitoringPoint', error)
  }
}

export async function updateMonitoringPoint(monitoringPoint: MonitoringPoint) {
  try {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: monitoringPoint.name, type: monitoringPoint.type, machineId: monitoringPoint.machineId })
    };
    const response = await fetch(`http://localhost:3001/monitoring-points/${monitoringPoint.id}`, requestOptions);

    if (!response.ok) {
      throw new Error("Falhou em updateMonitoringPoint");
    }

  } catch (error: unknown) {
    console.log('Error no updateMonitoringPoint', error)
  }
}

export async function deleteMonitoringPoint(monitoringPoint: MonitoringPoint) {
  try {
    const requestOptions = {
      method: 'DELETE'
    };
    const response = await fetch(`http://localhost:3001/monitoring-points/${monitoringPoint.id}`, requestOptions);

    if (!response.ok) {
      throw new Error("Falhou em deleteMonitoringPoints");
    }

  } catch (error: unknown) {
    console.log('Error no deleteMonitoringPoints', error)
  }
}