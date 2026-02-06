import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const registerPostSchema = z.object({
  name: z.string().max(20),
  email: z.email(),
  password: z.string().min(6).max(20)
})

export async function POST(request: NextRequest) {
  const body = await request.json()

  const validateData = registerPostSchema.parse(body)
  // processamento de dados
  // envio para a API

  return NextResponse.json(
    {
      success: true,
      data: validateData,
      message: "Dados enviados com sucesso."
    }
  )
}
