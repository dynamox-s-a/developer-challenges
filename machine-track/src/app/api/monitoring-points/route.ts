import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/client';
import { z } from "zod";
import { authMiddleware } from '@/lib/middleware';

const monitoringPointSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long."),
  machineId: z.string().nonempty("Machine ID is required."),
});

export const POST = authMiddleware(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { name, machineId } = monitoringPointSchema.parse(body);

    const machine = await prisma.machine.findUnique({
      where: { id: parseInt(machineId) },
    });

    if (!machine) {
      return NextResponse.json(
        { error: "Machine not found" },
        { status: 404 }
      );
    }

    const monitoringPoint = await prisma.monitoringPoint.create({
      data: { name, machineId: machine.id },
    });

    return NextResponse.json(monitoringPoint, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Failed to create monitoring point:", error);
    
    return NextResponse.json(
      { error: "Failed to create monitoring point" },
      { status: 500 }
    );
  }
});


export const GET = authMiddleware(async (req: NextRequest, res) => {
  const url = new URL(req.url);
  const searchParams = url.searchParams;

  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '5';
  const sort = searchParams.get('sort') || 'name';
  const order = searchParams.get('order') || 'asc';

  const skip = (Number(page) - 1) * Number(limit);
  const orderBy = { [sort]: order };

  const points = await prisma.monitoringPoint.findMany({
    skip,
    take: Number(limit),
    orderBy,
    include: { machine: true, sensors: true },
  });

  return NextResponse.json(points, { status: 200 });
});