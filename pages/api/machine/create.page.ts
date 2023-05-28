import { NextApiRequest, NextApiResponse } from "next";
import prisma from "prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const name: string = req.body.name;
  const type: string = req.body.type;
  const sensorId: number = req.body.sensorId;

  const machine = await prisma.machine.create({
    data: { name, type, sensorId },
  });
  res.status(200).json(machine);
}
