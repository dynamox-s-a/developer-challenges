import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query;
    const { title, type } = req.body;
    const parsedId = parseInt(id as string);
    const edited = await prisma.machine.update({
      where: {
        id: parsedId,
      },
      data: {
        title: title,
        type: type,
      },
    });
    return res.status(200).json(edited);
  } catch (error) {
    console.error(`An error occurred while trying to edit machine ${error}`);
  }
}
