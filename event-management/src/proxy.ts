import { NextRequest, NextResponse } from 'next/server';

export function proxy(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const { pathname } = req.nextUrl;

  if (pathname === '/login') {
    if (token) {
      return NextResponse.redirect(new URL('/events', req.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (pathname.startsWith('/admin')) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/events', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/events/:path*', '/admin/:path*', '/login'],
};
