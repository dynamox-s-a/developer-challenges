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
    if (Array.isArray(req.query.param)) {
      const skip: number = parseInt(req.query.param[0] || "");
      const take: number = parseInt(req.query.param[1] || "");

      const [count, monitoringPoints] = await prisma.$transaction([
        prisma.monitoringPoint.count(),
        prisma.monitoringPoint.findMany({
          skip,
          take,
          include: {
            machine: true,
            sensor: true,
          },
        }),
      ]);

      res.status(200).json({ count, monitoringPoints });
    } else {
      res.status(500).json({ error: "url params error" });
    }
  }
}
