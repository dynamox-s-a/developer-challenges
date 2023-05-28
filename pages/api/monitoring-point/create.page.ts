import { NextApiRequest, NextApiResponse } from "next";
import prisma from "prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const name: string = req.body.name;
  const sensorId: number = req.body.sensorId;

  const monitoringPoint = await prisma.monitoringPoint.create({
    data: { name, sensorId },
  });
  res.status(200).json(monitoringPoint);
}
