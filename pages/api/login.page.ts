import { NextApiRequest, NextApiResponse } from "next";
import prisma from "prisma/client";
import IsSigned from "lib/auth/is-signed";

const fakeToken =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJpc3N1ZXIiLCJpYXQiOjE2ODU1NzA5OTgsImV4cCI6MTcxNzEwNjk5OCwiYXVkIjoiYXVkaWVuY2UuY29tIiwic3ViIjoic3ViamVjdCJ9.ft3gDKl_QO5OZ_SDY-bfVRm5d95f48kvfCqyuzgiwI0";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const email: string = req.body.email;
  const password: string = req.body.password;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user?.password == password)
    res.status(200).json({ token: fakeToken, email, name: user.name });
  else res.status(401).json({ error: "BadCredentials" });
}
