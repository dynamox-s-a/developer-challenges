import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export default async function getUserId(req: NextRequest) {
  const token = await getToken({ req });
  const userId = token ? parseInt(token!.sub!) : 0;
  return userId;
}
