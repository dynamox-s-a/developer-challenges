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
    const id: number = req.body.id;
    const name: string = req.body.name;
    const type: string = req.body.type;

    const machine = await prisma.machine.update({
      where: { id },
      data: { name, type },
    });

    res.status(200).json(machine);
  }
}
