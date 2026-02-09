import { canMachineReceiveSensor } from "./machineAndSensor";
import { MachineType, SensorModel } from "../types/enum";

describe("Business rule: Sensors vs Machines", () => {
    test("Should not allow TcAg Sensor Model to a Machine of type Pump", () => {
        expect(canMachineReceiveSensor(MachineType.Pump, SensorModel.TCAG)).toBe(false);
    });

    test("Should allow a HF+ Sensor Model to a Machine of type Pump", () => {
        expect(canMachineReceiveSensor(MachineType.Pump, SensorModel.HF_PLUS)).toBe(true);
    });
});