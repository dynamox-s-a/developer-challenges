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

    if (data.length === 0) {
      return res.status(404).json({ error: "No machines found." });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error." });
  }
}
