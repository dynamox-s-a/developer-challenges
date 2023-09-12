import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  const response = id
    ? await fetch(process.env.API_URL + '/api/spot/' + id, { cache: 'no-cache' })
    : await fetch(process.env.API_URL + '/api/spot', { cache: 'no-cache' })
  if (!response.ok) {
    return response
  }
  const spots = await response.json()
  return NextResponse.json(spots)
}

export async function POST(request: NextRequest) {
  const { name, machineId, sensorId, sensorModel } = await request.json()

  const response = await fetch(process.env.API_URL + '/api/spot', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, machineId, sensorId, sensorModel })
  })
  if (!response.ok) {
    return response
  }
  const spot = await response.json()
  return NextResponse.json(spot)
}

export async function PATCH(request: NextRequest) {
  const { id, name, machineId, sensorId, sensorModel } = await request.json()
  const response = await fetch(process.env.API_URL + '/api/spot/' + id, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id, name, machineId, sensorId, sensorModel })
  })
  if (!response.ok) {
    return response
  }
  const spot = await response.json()
  return NextResponse.json(spot)
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  const response = await fetch(process.env.API_URL + '/api/spot/' + id, {
    method: 'DELETE'
  })
  if (!response.ok) {
    return response
  }
  return NextResponse.json({ status: 200, ok: true })
}
