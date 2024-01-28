import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { putSchema } from "../schema";

interface Props {
  params: {
    id: string;
  };
}

export async function PUT(request: NextRequest, { params: { id } }: Props) {
  const body = await request.json();
  const validation = putSchema.safeParse(body);

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

export async function DELETE(request: NextRequest, { params: { id } }: Props) {
  const machine = await prisma.machine.findUnique({
    where: { id: parseInt(id) },
  });

  if (!machine) {
    return NextResponse.json({ message: "Machine not found" }, { status: 404 });
  }

  await prisma.machine.delete({
    where: { id: parseInt(id) },
  });

  return NextResponse.json({ message: `Machine ${id} has been deleted` });
}
