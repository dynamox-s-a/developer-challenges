import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/client';
import { authMiddleware } from '@/lib/middleware';

export const GET = authMiddleware(async () => {
  try {
    const machines = await prisma.machine.findMany();
    return NextResponse.json(machines, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch machines' }, { status: 500 });
  }
});

export const POST = authMiddleware(async (req: NextRequest) => {
  const { name, type } = await req.json();

  try {
    const machine = await prisma.machine.create({ data: { name, type } });
    return NextResponse.json(machine, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create machine' }, { status: 500 });
  }
});