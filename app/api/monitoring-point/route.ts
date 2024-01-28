import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { postSchema } from "./schema";

export async function GET(request: NextRequest) {
  const monitoringPoints = await prisma.monitoringPoint.findMany();
  //TODO: pegar somente os monitoringPoints do usuário da sessão

  return NextResponse.json(monitoringPoints);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = postSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, {
      status: 400,
    });
  }

  const validatedBody = validation.data;
  const monitoringPoint = await prisma.monitoringPoint.findFirst({
    where: { name: validatedBody.name },
  });

  if (monitoringPoint) {
    return NextResponse.json(
      { message: "Monitoring point with this name already exists" },
      { status: 400 }
    );
  }

  const machine = await prisma.machine.findUnique({
    where: { id: validatedBody.machineId },
  });

  if (!machine) {
    return NextResponse.json(
      {
        message:
          "No machine with this id was found. It's necessary to provide an id from a registered machine",
      },
      { status: 400 }
    );
  }

  const createdMonitoringPoint = await prisma.monitoringPoint.create({
    data: {
      userId: 1, //TODO: passar o id do usuário da sessão
      machineId: validatedBody.machineId,
      name: validatedBody.name,
      sensor: validatedBody.sensor,
    },
  });

  return NextResponse.json(createdMonitoringPoint);
}
