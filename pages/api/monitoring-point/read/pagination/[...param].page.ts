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
    if (Array.isArray(req.query.id)) {
      const skip: number = parseInt(req.query.id[0] || "");
      const take: number = parseInt(req.query.id[1] || "");

      const monitoringPoints = await prisma.monitoringPoint.findMany({
        skip,
        take,
      });

      res.status(200).json(monitoringPoints);
    } else {
      res.status(500).json({ error: "url params error" });
    }
  }
}
