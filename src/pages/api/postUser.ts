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
    const { email } = req.body;

    const newUser = await prisma.user.create({
      data: {
        email: email,
      },
    });
    console.log(newUser);
    return res.status(200).json(newUser);
  } catch (error) {
    return res.status(500).json({ error });
  }
}
