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
    const type: string = req.body.type;

    const machineConflict = await prisma.machine.findUnique({
      where: { name },
    });

    if (!!machineConflict)
      res
        .status(409)
        .json({ error: "Esse nome de máquina já está cadastrada" });
    else {
      const machine = await prisma.machine.create({
        data: { name, type },
      });
      res.status(200).json(machine);
    }
  }
}
