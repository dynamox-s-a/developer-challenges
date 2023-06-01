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
    const model: string = req.body.model;
    const name: string = req.body.name;
    const sensor = await prisma.sensor.create({
      data: { model, name },
    });
    res.status(200).json(sensor);
  }
}
