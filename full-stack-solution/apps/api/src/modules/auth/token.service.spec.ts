import { UnauthorizedError } from "../../shared/errors/app-error";
import { TokenService } from "./token.service";

const SECRET = "x".repeat(32);
const base64url = (value: object) =>
  Buffer.from(JSON.stringify(value)).toString("base64url");

describe("TokenService", () => {
  const service = new TokenService(SECRET, "1h");

  it("signs a token that verifies back to the user id", () => {
    expect(service.verify(service.sign("user-1"))).toBe("user-1");
  });

  it("rejects a token signed with another secret", () => {
    const foreign = new TokenService("y".repeat(32), "1h").sign("user-1");
    expect(() => service.verify(foreign)).toThrow(UnauthorizedError);
  });

  it("rejects an expired token", () => {
    const expired = new TokenService(SECRET, -10).sign("user-1"); // already expired
    expect(() => service.verify(expired)).toThrow(UnauthorizedError);
  });

  it('rejects an unsigned token that claims "alg: none"', () => {
    const forged = `${base64url({ alg: "none", typ: "JWT" })}.${base64url({ sub: "user-1" })}.`;
    expect(() => service.verify(forged)).toThrow(UnauthorizedError);
  });

  it("rejects garbage", () => {
    expect(() => service.verify("not-a-jwt")).toThrow(UnauthorizedError);
  });
});
