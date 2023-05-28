import { NextApiRequest, NextApiResponse } from "next";
import prisma from "prisma/client";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(req.body);
}
