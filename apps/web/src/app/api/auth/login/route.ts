import { NextRequest, NextResponse } from "next/server";
import z, { success } from "zod";

const loginPostSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(20),
})

const loginPostPayload = z.object({
  name: z.string().max(20),
  email: z.email(),
  token: z.string(),
})

type loginToken = z.infer<typeof loginPostPayload>

export async function LOGIN(request: NextRequest) {
  const body = request.json()

  const validatedData = loginPostSchema.parse(body)
  console.log(validatedData) 
  // fazer a verificação aqui, lul
  // enviar para a API
  // receber retorno do token!!
  const returnedData: loginToken =
  {
    name: "NomeFicticio",
    email: "a@gmail.com.br",
    token: "TokenFicticio"
  }

  return NextResponse.json(
    {
      success: true,
      data: returnedData,
      message: "Token retornado com sucesso, usuário logado."
    }
  )
}