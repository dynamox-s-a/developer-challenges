import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const response = await fetch(process.env.API_URL + '/api/machine', { cache: 'no-cache' })
  if (!response.ok) {
    return response
  }
  const machines = await response.json()
  return NextResponse.json(machines)
}

export async function POST(request: NextRequest) {
  const { name, type } = await request.json()

  const response = await fetch(process.env.API_URL + '/api/machine', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, type })
  })
  if (!response.ok) {
    return response
  }
  const user = await response.json()
  return NextResponse.json(user)
}
