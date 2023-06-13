import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query;
    const parsedId = parseInt(id as string);
    const deleted = await prisma.machine.delete({
      where: {
        id: parsedId,
      },
    });
    return res.status(200).json(deleted);
  } catch (error) {
    console.error(`An error occurred while trying to delete person ${error}`);
  }
}
