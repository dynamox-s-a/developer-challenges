import { describe, expect, it } from "vitest";
import UserRepositoryMemory from "../../src/repository/UserRepositoryMemory";
import { AuthService } from "../../src/service/AuthService";

describe("AuthService", () => {
    it("should register a user", async () => {
        const userRepository = new UserRepositoryMemory();
        const authService = new AuthService(userRepository);
        await authService.register("test@test.com", "test");
        const user = await userRepository.findByEmail("test@test.com");
        expect(user?.email).toBe("test@test.com");
    });

    it("should login a user", async () => {
        const userRepository = new UserRepositoryMemory();
        const authService = new AuthService(userRepository);
        await authService.register("test2@test.com", "test");
        const token = await authService.login("test2@test.com", "test");
        expect(token).toBeDefined();
    });

    it("should not login a user with invalid credentials", async () => {
        const userRepository = new UserRepositoryMemory();
        const authService = new AuthService(userRepository);
        await authService.register("test3@test.com", "test");
        await expect(authService.login("test3@test.com", "wrong")).rejects.toThrow("Invalid credentials");
    });
});