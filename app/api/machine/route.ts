import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { postSchema } from "./schema";

export async function GET(request: NextRequest) {
  const machines = await prisma.machine.findMany();

  return NextResponse.json(machines);
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
  const machine = await prisma.machine.create({
    data: {
      name: validatedBody.name,
      type: validatedBody.type,
      userId: validatedBody.userId,
    },
  });

  return NextResponse.json(machine);
}
