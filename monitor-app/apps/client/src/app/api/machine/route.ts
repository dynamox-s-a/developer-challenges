import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  const response = id
    ? await fetch(process.env.API_URL + '/api/machine/' + id, { cache: 'no-cache' })
    : await fetch(process.env.API_URL + '/api/machine', { cache: 'no-cache' })
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
  const machine = await response.json()
  return NextResponse.json(machine)
}

export async function PATCH(request: NextRequest) {
  const { id, name, type } = await request.json()
  const response = await fetch(process.env.API_URL + '/api/machine/' + id, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id, name, type })
  })
  if (!response.ok) {
    return response
  }
  const machine = await response.json()
  return NextResponse.json(machine)
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  const response = await fetch(process.env.API_URL + '/api/machine/' + id, {
    method: 'DELETE'
  })
  if (!response.ok) {
    return response
  }
  return NextResponse.json({ status: 200, ok: true })
}
