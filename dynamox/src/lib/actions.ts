"use server";

import prisma from "./prisma";
import {
  MachineFormValidationSchema,
  MonitoringPointFormValidationSchema,
  SensorModelFormValidationSchema,
} from "./validation";

type CurrentState = { success: boolean; error: boolean };

export const createMachine = async (
  currentState: CurrentState,
  data: MachineFormValidationSchema
) => {
  console.log(data);
  try {
    await prisma.machine.create({
      data: {
        name: data.name,
        type: data.type,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateMachine = async (
  currentState: CurrentState,
  data: MachineFormValidationSchema
) => {
  console.log(data);

  try {
    // Fetch existing sensors associated with this machine
    const sensors = await prisma.sensor.findMany({
      where: {
        monitoringPoint: {
          machineId: data.id,
        },
      },
      select: {
        model: true,
      },
    });

    // Check if there are restricted sensors
    const hasRestrictedSensor = sensors.some(
      (sensor) => sensor.model === "TcAg" || sensor.model === "TcAs"
    );

    // If there are restricted sensors and trying to update to 'Pump'
    if (hasRestrictedSensor && data.type === "Pump") {
      console.error(
        "Cannot change machine type to Pump due to associated sensors"
      );
      return {
        success: false,
        error: true,
        message:
          "Cannot change machine type to Pump if it has TcAg or TcAs sensors.",
      };
    }

    await prisma.machine.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        type: data.type,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      error: true,
      message: "An unexpected error occurred during machine update.",
    };
  }
};

export const deleteMachine = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  const machineId = parseInt(id);

  try {
    // First, delete sensors associated with monitoring points of this machine
    await prisma.sensor.deleteMany({
      where: {
        monitoringPoint: {
          machineId: machineId,
        },
      },
    });

    // Then, delete the monitoring points associated with this machine
    await prisma.monitoringPoint.deleteMany({
      where: {
        machineId: machineId,
      },
    });

    // Finally, delete the machine
    await prisma.machine.delete({
      where: {
        id: machineId,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      error: true,
      message: "Failed to delete machine.",
    };
  }
};
export const createMonitoringPoint = async (
  currentState: CurrentState,
  data: MonitoringPointFormValidationSchema
) => {
  console.log(data);
  try {
    await prisma.monitoringPoint.create({
      data: {
        name: data.name,
        machineId: data.machines,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateMonitoringPoint = async (
  currentState: CurrentState,
  data: MonitoringPointFormValidationSchema
) => {
  console.log(data);
  try {
    await prisma.monitoringPoint.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        machineId: data.machines,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteMonitoringPoint = async (
  currentState: CurrentState,
  data: { id: number }
) => {
  try {
    await prisma.monitoringPoint.delete({
      where: {
        id: data.id,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createMonitoringPointSensorModel = async (
  currentState: CurrentState,
  data: SensorModelFormValidationSchema
) => {
  console.log(data);

  if (data.monitoringPointId === undefined) {
    console.error("monitoringPointId is undefined");
    return {
      success: false,
      error: true,
      message: "Monitoring Point ID is required.",
    };
  }

  try {
    const monitoringPoint = await prisma.monitoringPoint.findUnique({
      where: {
        id: data.monitoringPointId,
      },
    });

    if (!monitoringPoint) {
      console.error("MonitoringPoint not found");
      return {
        success: false,
        error: true,
        message: "Monitoring point not found.",
      };
    }

    const machine = await prisma.machine.findUnique({
      where: {
        id: monitoringPoint.machineId,
      },
    });

    if (!machine) {
      console.error("Machine not found");
      return { success: false, error: true, message: "Machine not found." };
    }

    if (
      (data.model === "TcAg" || data.model === "TcAs") &&
      machine.type === "Pump"
    ) {
      console.error("Invalid sensor setup");
      return {
        success: false,
        error: true,
        message:
          "TcAg and TcAs sensors can't be set up for machines of the type Pump.",
      };
    }

    await prisma.sensor.create({
      data: {
        model: data.model,
        monitoringPointId: data.monitoringPointId,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      error: true,
      message: "An unexpected error occurred.",
    };
  }
};

export const updateMonitoringPointSensorModel = async (
  currentState: CurrentState,
  data: SensorModelFormValidationSchema
) => {
  console.log(data);
  try {
    await prisma.sensor.updateMany({
      where: {
        monitoringPointId: data.id,
      },
      data: {
        model: data.model,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteMonitoringPointSensorModel = async (
  currentState: CurrentState,
  data: { id: number }
) => {
  try {
    await prisma.monitoringPoint.delete({
      where: {
        id: data.id,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
