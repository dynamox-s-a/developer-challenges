import { test, expect, describe } from "vitest";
import { MachineFactory } from "../../src/domain/MachineFactory";
import { FanMachine } from "../../src/domain/FanMachine";
import { FanMonitoringPoint } from "../../src/domain/FanMonitoringPoint";
import { PumpMachine } from "../../src/domain/PumpMachine";
import { PumpMonitoringPoint } from "../../src/domain/PumpMonitoringPoint";
import { MachineType, SensorType } from "../../src/types/types";


describe("MachineFactory", () => {
    test("should create a pump machine", () => {
        const pumpMachine = MachineFactory.create("userId", "pump1", MachineType.PUMP);
        expect(pumpMachine.id).toBeDefined();
        expect(pumpMachine.name).toBe("pump1");
        expect(pumpMachine.type).toBe(MachineType.PUMP);
        expect(pumpMachine).toBeInstanceOf(PumpMachine);
    });

    test("should create a fan machine", () => {
        const fanMachine = MachineFactory.create("userId", "fan1", MachineType.FAN);
        expect(fanMachine.id).toBeDefined();
        expect(fanMachine.name).toBe("fan1");
        expect(fanMachine.type).toBe(MachineType.FAN);
        expect(fanMachine).toBeInstanceOf(FanMachine);
    });

    test("should throw error for empty name", () => {
        expect(() => MachineFactory.create("userId", "", MachineType.PUMP)).toThrow("Machine name cannot be empty");
        expect(() => MachineFactory.create("userId", "   ", MachineType.FAN)).toThrow("Machine name cannot be empty");
    });

    test("should throw error for invalid machine type", () => {
        expect(() => MachineFactory.create("userId", "username", "invalid" as MachineType)).toThrow("Invalid machine type");
    });

    test("should get supported types", () => {
        const types = MachineFactory.getSupportedTypes();
        expect(types).toEqual([MachineType.PUMP, MachineType.FAN]);
    });
});

describe("PumpMachine", () => {
    test("should create pump machine with monitoring points", () => {
        const pump = PumpMachine.create("userId", "test-pump", MachineType.PUMP);
        const monitoringPoint = PumpMonitoringPoint.create("pressure-sensor", SensorType.HFPlus);
        pump.addMonitoringPoint(monitoringPoint);
        expect(pump.getMonitoringPoints()).toHaveLength(1);
        expect(pump.getMonitoringPoint(monitoringPoint.sensorId)).toBeDefined();
    });

    test("should remove monitoring point", () => {
        const pump = PumpMachine.create("userId", "test-pump", MachineType.PUMP);
        const monitoringPoint = PumpMonitoringPoint.create("pressure-sensor", SensorType.HFPlus);
        pump.addMonitoringPoint(monitoringPoint);
        const removed = pump.removeMonitoringPoint(monitoringPoint.sensorId);
        expect(removed).toBe(true);
        expect(pump.getMonitoringPoints()).toHaveLength(0);
    });

    test("should return false when removing non-existent monitoring point", () => {
        const pump = PumpMachine.create("userId", "test-pump", MachineType.PUMP);
        const removed = pump.removeMonitoringPoint("non-existent-id");
        expect(removed).toBe(false);
    });

    test("should only accept HFPlus sensors for monitoring points", () => {
        const pump = PumpMachine.create("userId", "test-pump", MachineType.PUMP);
        const validPoint = PumpMonitoringPoint.create("pressure-sensor", SensorType.HFPlus);
        pump.addMonitoringPoint(validPoint);
        expect(pump.getMonitoringPoints()).toHaveLength(1);
    });
});

describe("FanMachine", () => {
    test("should create fan machine with monitoring points", () => {
        const fan = FanMachine.create("userId", "test-fan", MachineType.FAN);
        const monitoringPoint = FanMonitoringPoint.create("temp-sensor", SensorType.TcAg);
        fan.addMonitoringPoint(monitoringPoint);
        expect(fan.getMonitoringPoints()).toHaveLength(1);
        expect(fan.getMonitoringPoint(monitoringPoint.sensorId)).toBeDefined();
    });

    test("should remove monitoring point", () => {
        const fan = FanMachine.create("userId", "test-fan", MachineType.FAN);
        const monitoringPoint = FanMonitoringPoint.create("temp-sensor", SensorType.TcAg);
        fan.addMonitoringPoint(monitoringPoint);
        const removed = fan.removeMonitoringPoint(monitoringPoint.sensorId);
        expect(removed).toBe(true);
        expect(fan.getMonitoringPoints()).toHaveLength(0);
    });
});

describe("Monitoring Points", () => {
    test("should create pump monitoring point", () => {
        const point = PumpMonitoringPoint.create("pressure-sensor", SensorType.HFPlus);
        expect(point.name).toBe("pressure-sensor");
        expect(point.sensorType).toBe(SensorType.HFPlus);
        expect(point.sensorId).toBeDefined();
    });

    test("should create fan monitoring point", () => {
        const point = FanMonitoringPoint.create("temp-sensor", SensorType.TcAg);
        expect(point.name).toBe("temp-sensor");
        expect(point.sensorType).toBe(SensorType.TcAg);
        expect(point.sensorId).toBeDefined();
    });

    test("should throw error for empty monitoring point name", () => {
        const point = PumpMonitoringPoint.create("test", SensorType.HFPlus);
        expect(() => point.name = "").toThrow("Name cannot be empty");
        expect(() => point.name = "   ").toThrow("Name cannot be empty");
    });

    test("should only allow HFPlus sensors for pump monitoring points", () => {
        const validPoint = PumpMonitoringPoint.create("pressure-sensor", SensorType.HFPlus);
        expect(validPoint.sensorType).toBe(SensorType.HFPlus);
    });

    test("should only allow TcAg and TcAs sensors for fan monitoring points", () => {
        const tempPoint = FanMonitoringPoint.create("temp-sensor", SensorType.TcAg);
        const humidityPoint = FanMonitoringPoint.create("humidity-sensor", SensorType.TcAs);
        expect(tempPoint.sensorType).toBe(SensorType.TcAg);
        expect(humidityPoint.sensorType).toBe(SensorType.TcAs);
    });
});

describe("Machine Properties", () => {
    test("should update machine name", () => {
        const machine = MachineFactory.create("userId", "old-name", MachineType.PUMP);
        machine.name = "new-name";
        expect(machine.name).toBe("new-name");
    });

    test("should throw error for empty machine name", () => {
        const machine = MachineFactory.create("userId", "test", MachineType.PUMP);
        expect(() => machine.name = "").toThrow("Name cannot be empty");
        expect(() => machine.name = "   ").toThrow("Name cannot be empty");
    });

    test("should update machine type", () => {
        const machine = MachineFactory.create("userId", "test", MachineType.PUMP);
        machine.type = MachineType.FAN;
        expect(machine.type).toBe(MachineType.FAN);
    });

    test("should generate unique IDs", () => {
        const machine1 = MachineFactory.create("userId", "test1", MachineType.PUMP);
        const machine2 = MachineFactory.create("userId", "test2", MachineType.FAN);
        expect(machine1.id).not.toBe(machine2.id);
    });
});


