import { loginSchema } from "./auth";

describe("LoginSchema", () => {
  it("accepts valid credential and trims the email", () => {
    const result = loginSchema.parse({
      email: "       a@b.com",
      password: "x",
    });
    expect(result.email).toBe("a@b.com");
  });

  it("rejects an invalid email", () => {
    expect(
      loginSchema.safeParse({
        email: "nope",
        password: "x",
      }).success,
    ).toBe(false);
  });

  it("rejects an empty password", () => {
    expect(
      loginSchema.safeParse({
        email: "a@b.com",
        password: "",
      }).success,
    ).toBe(false);
  });
});
