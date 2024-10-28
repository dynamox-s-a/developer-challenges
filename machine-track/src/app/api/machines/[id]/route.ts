import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/client';
import { authMiddleware } from '@/lib/middleware';

// Obter detalhes de uma máquina específica
export const GET = authMiddleware(async (req: NextRequest, context: { params?: { id: string } }) => {
  const { id } = context.params || {};

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    const machine = await prisma.machine.findUnique({ where: { id: Number(id) } });
    if (!machine) {
      return NextResponse.json({ error: 'Machine not found' }, { status: 404 });
    }
    return NextResponse.json(machine, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch machine' }, { status: 500 });
  }
});

// Atualizar uma máquina
export const PUT = authMiddleware(async (req: NextRequest, context: { params?: { id: string } }) => {
  const { id } = context.params || {};
  const { name, type } = await req.json();

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    const updatedMachine = await prisma.machine.update({
      where: { id: Number(id) },
      data: { name, type },
    });
    return NextResponse.json(updatedMachine, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update machine' }, { status: 500 });
  }
});

// Deletar uma máquina
export const DELETE = authMiddleware(async (req: NextRequest, context: { params?: { id: string } }) => {
  const { id } = context.params || {};

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    await prisma.machine.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: 'Machine deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete machine' }, { status: 500 });
  }
});
