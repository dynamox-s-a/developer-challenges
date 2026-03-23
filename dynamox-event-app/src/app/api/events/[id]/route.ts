import { NextResponse } from "next/server"
import { events } from "@/lib/eventsStore"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await params
    const body = await req.json()

    const index = events.findIndex(e => String(e.id) === id)

    if (index === -1) {
      return NextResponse.json(
        { message: "Event not found" },
        { status: 404 }
      )
    }

    events[index] = {
      ...events[index],
      ...body
    }

    return NextResponse.json(events[index])

  } catch (error) {

    return NextResponse.json(
      { message: "Failed to update event" },
      { status: 500 }
    )

  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await params

    const index = events.findIndex(e => String(e.id) === id)

    if (index === -1) {
      return NextResponse.json(
        { message: "Event not found" },
        { status: 404 }
      )
    }

    events.splice(index, 1)

    return NextResponse.json({
      message: "Event deleted successfully"
    })

  } catch (error) {

    return NextResponse.json(
      { message: "Failed to delete event" },
      { status: 500 }
    )

  }

}