import { NextResponse } from 'next/server'

export async function GET() {
  const response = await fetch(process.env.API_URL + '/api/machine', { cache: 'no-cache' })
  if (!response.ok) {
    return response
  }
  const machines = await response.json()
  return NextResponse.json(machines)
}
