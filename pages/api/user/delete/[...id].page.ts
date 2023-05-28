import { NextApiRequest, NextApiResponse } from "next";
import prisma from "prisma/client";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (Array.isArray(req.query.id)) req.query.id = req.query.id[0];
  const id = req.query.id;
  res.status(200).json(id);
}
