import { describe, expect, it } from "vitest";

describe("Server API", () => {
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

    it("should login a user -> set a cookie and return a token", async () => {
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
    });
});