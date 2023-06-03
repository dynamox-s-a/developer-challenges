import { NextApiRequest, NextApiResponse } from "next";
import prisma from "prisma/client";
import IsSigned from "lib/auth/is-signed";
import { userPostResultMsg as postResultMsg } from "lib/utils/post/post-result";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const isSigned = await IsSigned(req, res);
  if (!isSigned) {
    res.status(401).json(req.body);
  } else {
    const name: string = req.body.name;
    const model: string = req.body.model;

    const sensorConflict = await prisma.sensor.findUnique({
      where: { name },
    });

    if (!!sensorConflict)
      res.status(409).json({ error: postResultMsg.DATA_CONFLICT });
    else {
      const sensor = await prisma.sensor.create({
        data: { model, name },
      });
      res.status(200).json(sensor);
    }
  }
}
