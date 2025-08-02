import { MachineType, SensorType } from "../src/domain";

export function createUser(email: string, password: string, firstName: string, lastName: string) {
    return fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password, firstName, lastName })
    });
}

export function loginUser(email: string, password: string) {
    return fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });
}

export function createMachine(token: string, name: string, type: MachineType) {
    return fetch("http://localhost:3000/api/machines", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Cookie": `token=${token}`
        },
        body: JSON.stringify({ name, type })
    });
}

export function createMonitoringPoint(token: string, name: string, sensorType: SensorType, machineId: string) {
    return fetch("http://localhost:3000/api/monitoring-points", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Cookie": `token=${token}`
        },
        body: JSON.stringify({ name, sensorType, machineId })
    });
}

export function getMonitoringPoints(token: string) {
    return fetch("http://localhost:3000/api/monitoring-points", {
        headers: {
            "Content-Type": "application/json",
            "Cookie": `token=${token}`
        }
    });
}

export function deleteMonitoringPointBySensorId(token: string, sensorId: string) {
    return fetch(`http://localhost:3000/api/monitoring-points/sensor-id/${sensorId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Cookie": `token=${token}`
        }
    });
}

export function deleteMonitoringPointsByMachineId(token: string, machineId: string) {
    return fetch(`http://localhost:3000/api/monitoring-points/machine-id/${machineId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Cookie": `token=${token}`
        }
    });
}

export function getUser(token: string) {
    return fetch("http://localhost:3000/api/me", {
        headers: {
            "Content-Type": "application/json",
            "Cookie": `token=${token}`
        }
    });
}