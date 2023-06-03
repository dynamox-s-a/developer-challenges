import { NextApiRequest, NextApiResponse } from "next";
import prisma from "prisma/client";
import IsSigned from "lib/auth/is-signed";
import { userPostResultMsg as postResultMsg } from "lib/utils/post/post-result";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const isSigned = await IsSigned(req, res);
  if (!isSigned) {
    res.status(401).json(req.body);
  } else {
    const name: string = req.body.name;
    const email: string = req.body.email;
    const password: string = req.body.password;

    const userConflict = await prisma.user.findUnique({
      where: { email },
    });

    if (!!userConflict)
      res.status(409).json({ error: postResultMsg.DATA_CONFLICT });
    else {
      const user = await prisma.user.create({
        data: { name, email, password },
      });
      res.status(200).json(user);
    }
  }
}
