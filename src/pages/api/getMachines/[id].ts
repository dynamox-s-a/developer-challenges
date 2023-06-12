import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query;
    const data = await prisma.machine.findMany({
      where: {
        userId: Number(id),
      },
    });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json(error);
  }
}
