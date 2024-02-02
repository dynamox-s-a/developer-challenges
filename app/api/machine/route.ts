import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { schema } from "./schema";
import getUserId from "app/api/utils/getUserId";

export async function GET(req: NextRequest) {
  const userId = await getUserId(req);
  const machines = await prisma.machine.findMany({
    where: { userId },
  });

  return NextResponse.json(machines);
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
  const userId = await getUserId(req);
  const machine = await prisma.machine.create({
    data: {
      userId, //TODO: passar o id do usuário da sessão
      name: validatedBody.name,
      type: validatedBody.type,
    },
  });

  return NextResponse.json(machine);
}
