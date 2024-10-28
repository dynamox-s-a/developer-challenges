import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/client';
import { authMiddleware } from '@/lib/middleware';

// Criar ponto de monitoramento
export const POST = authMiddleware(async (req, res) => {
  const { name, machineId } = await req.json();

  const machine = await prisma.machine.findUnique({ where: { id: machineId } });
  if (!machine) {
    return NextResponse.json({ error: 'Machine not found' }, { status: 404 });
  }

  const point = await prisma.monitoringPoint.create({
    data: { name, machineId },
  });

  return NextResponse.json(point, { status: 201 });
});


// Listar pontos de monitoramento com paginação e ordenação
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