import machineRepository from '@/lib/database/machine/repository'
import dbConnect from '@/lib/database/mongoose'
import { NextResponse } from 'next/server'

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ machineId: string }> },
) {
  await dbConnect()
  const { machineId } = await params
  if (!machineId)
    return NextResponse.json({
      success: false,
      message: 'ID não está presente',
    })
  const deleteMachine = await machineRepository.delete(machineId)
  if (!deleteMachine.success)
    return NextResponse.json({
      success: false,
      message: deleteMachine.message,
    })
  return NextResponse.json({
    success: true,
    message: 'Máquina deletada com sucesso!',
    data: deleteMachine.data,
  })
}
