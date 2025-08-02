import { beforeEach, describe, expect, it } from "vitest";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { MachineType, SensorType } from "../../src/domain";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as jwt.Secret;

describe("should test service API endpoints", () => {
    beforeEach(async () => {
        // clear service databases before each test
        await fetch("http://localhost:3000/api/clear");
    });

    it("should register a user", async () => {
        const response = await fetch("http://localhost:3000/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: "test@test.com", password: "test" })
        });
        expect(response.status).toBe(201);
        const result = await response.json();
        expect(result.message).toBe("User registered successfully");
    });

    it("should login a user and set a cookie with a token", async () => {
        // First ensure user is registered
        await createUser("login@test.com", "test");
        // Now test login
        const response = await loginUser("login@test.com", "test");
        expect(response.status).toBe(200);
        // Check that the token cookie is set
        const setCookieHeader = response.headers.get("Set-Cookie");
        expect(setCookieHeader).toBeDefined();
        expect(setCookieHeader).toContain("token=");
        // Extract and verify token exists
        const tokenMatch = setCookieHeader?.match(/token=([^;]+)/);
        expect(tokenMatch).toBeDefined();
        expect(tokenMatch?.[1]).toBeTruthy();
        // check that the token is valid
        const token = tokenMatch?.[1];
        const decoded = jwt.verify(token as string, JWT_SECRET) as { email: string; userId: string };
        expect(decoded).toBeDefined();
        expect(decoded.email).toBe("login@test.com");
        expect(decoded.userId).toBeDefined();
    });

    it("should create a machine for a user", async () => {
        // First ensure user is registered
        await createUser("list@test.com", "test");
        // login to get a token
        const loginResponse = await loginUser("list@test.com", "test");
        const token = loginResponse.headers.get("Set-Cookie")?.split("token=")[1];
        expect(token).toBeDefined();
        // // create a machine
        const machineResponse = await fetch("http://localhost:3000/api/machines", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cookie": `token=${token}`
            },
            body: JSON.stringify({ name: "Machine 1", type: MachineType.FAN })
        });
        expect(machineResponse.status).toBe(201); ``
        const machine = await machineResponse.json();
        expect(machine.id).toBeDefined();

        // get the list of machines
        const machinesResponse = await fetch("http://localhost:3000/api/machines", {
            headers: {
                "Content-Type": "application/json",
                "Cookie": `token=${token}`
            }
        });
        expect(machinesResponse.status).toBe(200);
        const machines = await machinesResponse.json();
        expect(machines.length).toBe(1);
        expect(machines[0].id).toBe(machine.id);
        expect(machines[0].name).toBe("Machine 1");
        expect(machines[0].type).toBe(MachineType.FAN);
    });

    it("should create a monitoring point for a machine", async () => {
        // First ensure user is registered
        await createUser("list@test.com", "test");
        // login to get a token
        const loginResponse = await loginUser("list@test.com", "test");
        const token = loginResponse.headers.get("Set-Cookie")?.split("token=")[1];
        const machineResponse = await createMachine(token!, "Machine 1", MachineType.FAN);
        expect(machineResponse.status).toBe(201);
        const machine = await machineResponse.json();
        expect(machine.id).toBeDefined();
        // create a monitoring point
        const saveMonitoringPointResponse = await createMonitoringPoint(token!, "Monitoring Point 1", SensorType.TcAg, machine.id);
        expect(saveMonitoringPointResponse.status).toBe(201);
        const getMonitoringPointsResponse = await getMonitoringPoints(token!);
        expect(getMonitoringPointsResponse.status).toBe(200);
        const monitoringPoints = await getMonitoringPointsResponse.json();
        expect(monitoringPoints.length).toBe(1);
        expect(monitoringPoints[0].machineId).toBe(machine.id);
        expect(monitoringPoints[0].name).toBe("Monitoring Point 1");
        expect(monitoringPoints[0].sensorType).toBe(SensorType.TcAg);
        expect(monitoringPoints[0].sensorId).toBeDefined();
    });

    it("should delete a monitoring point by sensorId", async () => {
        // First ensure user is registered
        await createUser("list@test.com", "test");
        // login to get a token
        const loginResponse = await loginUser("list@test.com", "test");
        const token = loginResponse.headers.get("Set-Cookie")?.split("token=")[1];
        const machineResponse = await createMachine(token!, "Machine 1", MachineType.FAN);
        expect(machineResponse.status).toBe(201);
        const machine = await machineResponse.json();
        expect(machine.id).toBeDefined();
        const saveMonitoringPointResponse = await createMonitoringPoint(token!, "Monitoring Point 1", SensorType.TcAg, machine.id);
        expect(saveMonitoringPointResponse.status).toBe(201);
        const monitoringPoint = await saveMonitoringPointResponse.json();
        expect(monitoringPoint.id).toBeDefined();
        const deleteMonitoringPointResponse = await fetch(`http://localhost:3000/api/monitoring-points/sensor-id/${monitoringPoint.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Cookie": `token=${token}`
            }
        });
        expect(deleteMonitoringPointResponse.status).toBe(200);
        const getMonitoringPointsResponse = await getMonitoringPoints(token!);
        expect(getMonitoringPointsResponse.status).toBe(200);
        const monitoringPoints = await getMonitoringPointsResponse.json();
        expect(monitoringPoints.length).toBe(0);
    });

    it("should delete all monitoring points by machineId", async () => {
        // First ensure user is registered
        await createUser("list@test.com", "test");
        // login to get a token
        const loginResponse = await loginUser("list@test.com", "test");
        const token = loginResponse.headers.get("Set-Cookie")?.split("token=")[1];
        const machineResponse = await createMachine(token!, "Machine 1", MachineType.FAN);
        expect(machineResponse.status).toBe(201);
        const machine = await machineResponse.json();
        expect(machine.id).toBeDefined();
        const saveMonitoringPointResponse = await createMonitoringPoint(token!, "Monitoring Point 1", SensorType.TcAg, machine.id);
        expect(saveMonitoringPointResponse.status).toBe(201);
        const monitoringPoint = await saveMonitoringPointResponse.json();
        expect(monitoringPoint.id).toBeDefined();
        const deleteMonitoringPointResponse = await fetch(`http://localhost:3000/api/monitoring-points/machine-id/${machine.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Cookie": `token=${token}`
            }
        });
        expect(deleteMonitoringPointResponse.status).toBe(200);
        const getMonitoringPointsResponse = await getMonitoringPoints(token!);
        expect(getMonitoringPointsResponse.status).toBe(200);
        const monitoringPoints = await getMonitoringPointsResponse.json();
        expect(monitoringPoints.length).toBe(0);
    });
});

function createUser(email: string, password: string) {
    return fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });
}

function loginUser(email: string, password: string) {
    return fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });
}

function createMachine(token: string, name: string, type: MachineType) {
    return fetch("http://localhost:3000/api/machines", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Cookie": `token=${token}`
        },
        body: JSON.stringify({ name, type })
    });
}

function createMonitoringPoint(token: string, name: string, sensorType: SensorType, machineId: string) {
    return fetch("http://localhost:3000/api/monitoring-points", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Cookie": `token=${token}`
        },
        body: JSON.stringify({ name, sensorType, machineId })
    });
}

function getMonitoringPoints(token: string) {
    return fetch("http://localhost:3000/api/monitoring-points", {
        headers: {
            "Content-Type": "application/json",
            "Cookie": `token=${token}`
        }
    });
}