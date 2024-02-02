import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { schema } from "./schema";
import getUserId from "app/api/utils/getUserId";

export async function GET(req: NextRequest) {
  // const userId = await getUserId(req);
  const userId = 11;
  const monitoringPoints = await prisma.monitoringPoint.findMany({
    where: {
      machine: {
        userId,
      },
    },
    include: {
      machine: true,
      sensor: true,
    },
  });
  return NextResponse.json(monitoringPoints);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const validation = schema.safeParse(body);

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
      machineId: validatedBody.machineId,
      name: validatedBody.name,
      sensorId: validatedBody.sensorId,
    },
    include: {
      machine: true,
      sensor: true,
    },
  });

  return NextResponse.json(createdMonitoringPoint);
}
