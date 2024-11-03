import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('custom-auth-token');

  const protectedRoutes = ['/dashboard', '/profile'];

  if (token && req.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  if (protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL('/auth/sign-in', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/auth/:path*'],
};
