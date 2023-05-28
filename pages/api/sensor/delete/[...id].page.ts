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
    if (Array.isArray(req.query.id)) req.query.id = req.query.id[0];
    const id: number = parseInt(req.query.id || "");

    const deletedSensor = await prisma.sensor.delete({
      where: {
        id: id,
      },
    });

    res.status(200).json(deletedSensor);
  }
}
