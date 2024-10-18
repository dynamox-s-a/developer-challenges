"use server";
import prisma from "./prisma";
import { MachineFormValidation } from "./validation";

type CurrentState = { success: boolean; error: boolean };

export const createMachine = async (
  currentState: CurrentState,
  data: MachineFormValidation
) => {
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
  data: MachineFormValidation
) => {
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
