import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;
  const { method } = req;

  if (pathname === "/api/user" && method === "POST") return NextResponse.next();

  if (pathname.startsWith("/api") && !token) {
    return NextResponse.json(
      { message: "Unauthorized access" },
      { status: 401 }
    );
  }

  if (!token) return NextResponse.redirect(new URL("/", req.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/apii/:path*", "/dashboard"],
};

// * zero or more
// + one or more
// ? zero or one
