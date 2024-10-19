"use server";

import prisma from "./prisma";
import {
  MachineFormValidationSchema,
  MonitoringPointFormValidationSchema,
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

    // revalidatePath("/list/machines");
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
    await prisma.machine.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        type: data.type,
      },
    });

    // revalidatePath("/list/machines");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteMachine = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.machine.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/machines");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
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
