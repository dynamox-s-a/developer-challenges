import { beforeEach, describe, expect, it } from "vitest";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { MachineType } from "../../src/domain";

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
        await fetch("http://localhost:3000/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: "login@test.com", password: "test" })
        });
        // Now test login
        const response = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: "login@test.com", password: "test" })
        });
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
        await fetch("http://localhost:3000/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: "list@test.com", password: "test" })
        });
        // login to get a token
        const loginResponse = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: "list@test.com", password: "test" })
        });
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
});