import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/client';
import { authMiddleware } from '@/lib/middleware';

// Associar sensor a ponto de monitoramento
export const POST = authMiddleware(async (req: NextRequest) => {
  const { uniqueId, modelName, monitoringPointId } = await req.json();

  const validModels = ['TcAg', 'TcAs', 'HFPlus'];
  if (!validModels.includes(modelName)) {
    return NextResponse.json({ error: 'Invalid sensor model' }, { status: 400 });
  }

  const point = await prisma.monitoringPoint.findUnique({
    where: { id: monitoringPointId },
    include: { machine: true },
  });

  if (!point) {
    return NextResponse.json({ error: 'Monitoring point not found' }, { status: 404 });
  }

  if (point.machine.type === 'Pump' && ['TcAg', 'TcAs'].includes(modelName)) {
    return NextResponse.json({ error: 'Invalid sensor for Pump' }, { status: 400 });
  }

  const sensor = await prisma.sensor.create({
    data: { uniqueId, modelName, monitoringPointId },
  });

  return NextResponse.json(sensor, { status: 201 });
});
