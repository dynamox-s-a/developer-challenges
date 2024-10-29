import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/client";
import { authMiddleware } from '@/lib/middleware';
import { z } from "zod";

const sensorSchema = z.object({
  uniqueId: z.string().min(1, "Unique ID is required and must have at least 1 character."),
  modelName: z.enum(["TcAg", "TcAs", "HFPlus"]),
  monitoringPointId: z.string().nonempty("Monitoring point ID is required."),
});

export const POST = authMiddleware(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { uniqueId, modelName, monitoringPointId } = sensorSchema.parse(body);

    const point = await prisma.monitoringPoint.findUnique({
      where: { id: parseInt(monitoringPointId) },
      include: { machine: true },
    });

    if (!point) {
      return NextResponse.json(
        { error: "Monitoring point not found" },
        { status: 404 }
      );
    }

    if (point.machine.type === "Pump" && ["TcAg", "TcAs"].includes(modelName)) {
      return NextResponse.json(
        { error: "Invalid sensor for Pump" },
        { status: 400 }
      );
    }

    const sensor = await prisma.sensor.create({
      data: { uniqueId, modelName, monitoringPointId: point.id },
    });

    return NextResponse.json(sensor, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Failed to create sensor:", error);
    return NextResponse.json(
      { error: "Failed to create sensor" },
      { status: 500 }
    );
  }
});


export const GET = authMiddleware(async () => {
  try {
    const sensors = await prisma.sensor.findMany({
      include: { monitoringPoint: true },
    });
    return NextResponse.json(sensors, { status: 200 });
  } catch (error) {
    console.error("Error fetching sensors:", error);
    return NextResponse.json({ error: 'Failed to fetch sensors' }, { status: 500 });
  }
});