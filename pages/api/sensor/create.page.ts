import { NextApiRequest, NextApiResponse } from "next";
import prisma from "prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const model: string = req.body.model;

  const sensor = await prisma.sensor.create({
    data: { model },
  });
  res.status(200).json(sensor);
}
