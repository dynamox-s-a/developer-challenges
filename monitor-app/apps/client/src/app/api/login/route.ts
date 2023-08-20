import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest, res: NextResponse) {
  const { email, userPassword } = await request.json()

  const response = await fetch(process.env.API_URL + '/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, userPassword })
  })
  if (!response.ok) {
    return response
  }
  return NextResponse.json(response)
}
