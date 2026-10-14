import { SENSOR_MODELS } from "@full-stack-solution/shared";
import {
  toDatabaseSensorModel,
  toDomainSensorModel,
} from "./sensor-model.mapper";

describe("sensor model mapper", () => {
  it("stores HF+ as HF_PLUS and converts it back", () => {
    expect(toDatabaseSensorModel("HF+")).toBe("HF_PLUS");
    expect(toDomainSensorModel("HF_PLUS")).toBe("HF+");
  });

  it.each(SENSOR_MODELS)("round-trips %s", (model) => {
    expect(toDomainSensorModel(toDatabaseSensorModel(model))).toBe(model);
  });
});
