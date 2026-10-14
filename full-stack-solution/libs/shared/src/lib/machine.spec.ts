import { createMachineSchema, updateMachineSchema } from "./machine";

describe("createMachineSchema", () => {
  it("accepts a valid machine and trims the name", () => {
    const result = createMachineSchema.parse({
      name: "  Pump 01 ",
      type: "Pump",
    });
    expect(result).toEqual({ name: "Pump 01", type: "Pump" });
  });

  it("rejects an invalid type", () => {
    expect(
      createMachineSchema.safeParse({ name: "M1", type: "Motor" }).success,
    ).toBe(false);
  });

  it("rejects an empty name", () => {
    expect(
      createMachineSchema.safeParse({ name: "", type: "Fan" }).success,
    ).toBe(false);
  });
});

describe("updateMachineSchema", () => {
  it("accepts a partial update", () => {
    expect(updateMachineSchema.safeParse({ name: "New name" }).success).toBe(
      true,
    );
  });

  it("rejects an empty body", () => {
    expect(updateMachineSchema.safeParse({}).success).toBe(false);
  });
});
