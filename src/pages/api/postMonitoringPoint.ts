import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
    const { title, sensor, machineId, machineTitle, machineType, userId } =
      req.body;

    const newMonitoringPoint = await prisma.monitoringPoint.create({
      data: {
        title: title,
        sensor: sensor,
        userId: userId,
        machineId: machineId,
        machineTitle: machineTitle,
        machineType: machineType,
      },
    });

    return res.status(200).json(newMonitoringPoint);
  } catch (error) {
    return res.status(500).json({ error });
  }
}
