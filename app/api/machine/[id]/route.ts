import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { schema } from "../schema";
import getUserId from "../../utils/getUserId";

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
    where: { id: parseInt(id) },
  });

  if (!machine) {
    return NextResponse.json({ message: "Machine not found" }, { status: 404 });
  }

  const validatedBody = validation.data;
  const updatedMachine = await prisma.machine.update({
    where: { id: parseInt(id) },
    data: {
      name: validatedBody.name,
      type: validatedBody.type,
    },
  });

  return NextResponse.json(updatedMachine);
}

export async function DELETE(req: NextRequest, { params: { id } }: Props) {
  const machine = await prisma.machine.findUnique({
    where: { id: parseInt(id) },
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

  await prisma.machine.delete({
    where: { id: parseInt(id) },
  });

  return NextResponse.json({ message: `Machine ${id} has been deleted` });
}
