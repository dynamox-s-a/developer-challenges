import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const userCookie = request.cookies.get('user')?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/login')) {
    return NextResponse.next();
  }

  if (!token || !userCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const user = JSON.parse(userCookie);

  if (pathname.startsWith('/admin') && user.role !== 'admin') {
    return NextResponse.redirect(new URL('/events', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/events', '/events/:path*', '/admin', '/admin/:path*'],
};