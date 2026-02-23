import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const userCookie = request.cookies.get('user')?.value;
  const { pathname } = request.nextUrl;

  if (!token || !userCookie) {
    if (pathname.startsWith('/login')) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL('/login', request.url));
  }

  let user;

  try {
    user = JSON.parse(userCookie);
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (pathname.startsWith('/login')) {
    if (user.role === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    return NextResponse.redirect(new URL('/events', request.url));
  }

  if (pathname.startsWith('/admin') && user.role !== 'admin') {
    return NextResponse.redirect(new URL('/events', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/events', '/events/:path*', '/admin', '/admin/:path*'],
};