import machineRepository from '@/lib/database/machine/repository'
import { MachineModel } from '@/lib/database/machine/schema'
import dbConnect from '@/lib/database/mongoose'
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    await dbConnect()
    const jsonReq = await req.json()
    const validateJson = MachineModel.safeParse(jsonReq)

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
