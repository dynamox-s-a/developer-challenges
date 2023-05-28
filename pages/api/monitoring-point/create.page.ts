import { NextApiRequest, NextApiResponse } from "next";
import prisma from "prisma/client";
import IsSigned from "lib/auth/is-signed";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const isSigned = await IsSigned(req, res);
  if (!isSigned) {
    res.status(401).json(req.body);
  } else {
    const name: string = req.body.name;
    const sensorId: number = req.body.sensorId;

    const monitoringPoint = await prisma.monitoringPoint.create({
      data: { name, sensorId },
    });
    res.status(200).json(monitoringPoint);
  }
}
