import { NextResponse } from "next/server"
import { events } from "@/lib/eventsStore"

export async function GET() {
  return NextResponse.json(events)
}

export async function POST(req: Request) {

  const body = await req.json()

  const newEvent = {
    id: crypto.randomUUID(),
    ...body
  }

  events.push(newEvent)

  return NextResponse.json(newEvent)
}