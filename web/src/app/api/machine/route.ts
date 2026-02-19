/** biome-ignore-all lint/style/useTemplate: idk */
import machineRepository from '@/lib/database/machine/repository'
import dbConnect from '@/lib/database/mongoose'
import { CreateMachineSchema } from '@/types/zod/machine'
import { NextResponse, type NextRequest } from 'next/server'
import * as z from 'zod'

export async function POST(req: NextRequest) {
  try {
    await dbConnect()
    const jsonReq = await req.json()
    const validateJson = CreateMachineSchema.safeParse(jsonReq)

    if (!validateJson.success)
      return NextResponse.json(
        {
          success: false,
          message: validateJson.error.issues,
        },
        { status: 400 },
      )

    const createdMachine = await machineRepository.create(validateJson.data)
    if (!createdMachine.success)
      return NextResponse.json(
        {
          success: false,
          message: createdMachine.message,
        },
        { status: 400 },
      )

    return NextResponse.json(
      {
        success: true,
        message: 'Máquina cadastrada com sucesso',
        data: createdMachine.data,
      },
      { status: 200 },
    )
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message:
          err instanceof Error ? err.message : 'Erro interno do servidor',
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  await dbConnect()
  const machines = await machineRepository.getAllMachines()

  if (!machines.success)
    return NextResponse.json(
      { success: false, message: machines.message },
      { status: 400 },
    )

  return NextResponse.json(
    {
      success: true,
      message: machines.message,
      data: machines.data,
    },
    { status: 200 },
  )
}

export async function DELETE(req: NextRequest) {
  await dbConnect()
  const body = await req.json()
  const parsed = z.string().safeParse(body)

  if (!parsed.success)
    return NextResponse.json(
      {
        success: false,
        message:
          'Erro ao realizar o parsing dos dados: ' + parsed.error.message,
      },
      { status: 400 },
    )

  const deleted = await machineRepository.delete(parsed.data)
  if (!deleted.success)
    return NextResponse.json(
      {
        success: false,
        message: 'Erro ao deletar a machine: ' + deleted.message,
      },
      { status: 400 },
    )

  return NextResponse.json(
    {
      success: true,
      message: 'Maquina deletada com sucesso',
    },
    { status: 200 },
  )
}
