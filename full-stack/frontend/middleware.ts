import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { parseCookies } from 'nookies';

export function middleware(request: NextRequest) {
    const cookies = parseCookies({ req: request as any });
    const token = cookies.token;

    if (!token && request.nextUrl.pathname !== '/') {
        return NextResponse.redirect(new URL('/', request.url));
    }
}

export const config = {
    matcher: ['/machines/:path*', '/monitoring/:path*'],
};
