import { HttpStatusCode } from 'axios';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.JWT_SECRET,
    cookieName: '@dynamox-challenge:sessionToken'
  });

  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api') && !token) {
    return NextResponse.json({ message: 'Unauthorized access' }, { status: HttpStatusCode.Unauthorized });
  }

  if (pathname === '/auth') {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*', '/auth'],
};
