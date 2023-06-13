import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
    const { title, type } = req.body;

    const newMachine = await prisma.machine.create({
      data: {
        title: title,
        type: type,
        userId: 1,
      },
    });

    return res.status(200).json(newMachine);
  } catch (error) {
    return res.status(500).json({ error });
  }
}
