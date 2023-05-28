import { NextApiRequest, NextApiResponse } from "next";
import prisma from "prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const name: string = req.body.name;
  const email: string = req.body.email;
  const password: string = req.body.password;

  const user = await prisma.user.create({
    data: { name, email, password },
  });
  res.status(200).json(user);
}
