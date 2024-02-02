import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { schema } from "../schema";
import getUserId from "app/api/utils/getUserId";

interface Props {
  params: {
    id: string;
  };
}

export async function PUT(req: NextRequest, { params: { id } }: Props) {
  const body = await req.json();
  const validation = schema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, {
      status: 400,
    });
  }

  const machine = await prisma.machine.findUnique({
    where: { id: Number(id) },
  });

  if (!machine) {
    return NextResponse.json({ message: "Machine not found" }, { status: 404 });
  }

  const validatedBody = validation.data;
  const updatedMachine = await prisma.machine.update({
    where: { id: Number(id) },
    data: {
      name: validatedBody.name,
      type: validatedBody.type,
    },
  });

  return NextResponse.json(updatedMachine);
}

export async function DELETE(req: NextRequest, { params: { id } }: Props) {
  const machine = await prisma.machine.findUnique({
    where: { id: Number(id) },
  });

  if (!machine) {
    return NextResponse.json({ message: "Machine not found" }, { status: 404 });
  }

  const userId = await getUserId(req);

  if (machine.userId !== userId) {
    return NextResponse.json(
      {
        message: `This user does not have a machine with the specified id (${id})`,
      },
      { status: 401 }
    );
  }

  const monitorinPoints = await prisma.monitoringPoint.findMany({
    where: { machineId: Number(machine.id) },
  });

  const monitoringPointIds = monitorinPoints.map(async (monitorinPoint) => {
    await prisma.monitoringPoint.delete({
      where: { id: Number(monitorinPoint.id) },
    });
    return monitorinPoint.id;
  });

  await prisma.machine.delete({
    where: { id: Number(id) },
  });

  return NextResponse.json({ machineId: id, monitoringPointIds });
}
