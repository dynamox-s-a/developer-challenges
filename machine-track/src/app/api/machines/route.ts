import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/client';
import { authMiddleware } from '@/lib/middleware';
import { z } from 'zod';

const machineSchema = z.object({
  name: z.string().min(2, { message: "Name must have at least 2 characters." }),
  type: z.enum(["Pump", "Fan"], { errorMap: () => ({ message: "Invalid machine type." }) }),
});

export const GET = authMiddleware(async () => {
  try {
    const machines = await prisma.machine.findMany();
    return NextResponse.json(machines, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch machines' }, { status: 500 });
  }
});

export const POST = authMiddleware(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { name, type } = machineSchema.parse(body);

    const machine = await prisma.machine.create({ data: { name, type } });
    return NextResponse.json(machine, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create machine' }, { status: 500 });
  }
});