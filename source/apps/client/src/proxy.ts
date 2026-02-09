import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function proxy(request: NextRequest) {
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  const now = Math.floor(Date.now() / 1000);

  if (!process.env.NEXTAUTH_SECRET) {
    throw new Error('No NEXTAUTH_SECRET defined.');
  }

  const redirectToSignIn = () => {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/sign-in';
    return NextResponse.redirect(url);
  };

  // If no session token, redirect
  if (!token) {
    return redirectToSignIn();
  }

  // 1. Verify Next-Auth Session (Sliding)
  if (token.exp && (token.exp as number) < now) {
    console.log('Proxy: Session expired');
    return redirectToSignIn();
  }

  // 2. Verify Generated Access Token (Fixed expiry)
  if (token.accessToken) {
    try {
      // Manual decode of the JWT payload (standard JWT signed in [...nextauth].ts)
      const base64Url = (token.accessToken as string).split('.')[1];
      if (base64Url) {
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        
        console.log('Proxy: accessToken exp', payload);

        if (payload.exp && payload.exp < now) {
          console.log('Proxy: accessToken expired');
          return redirectToSignIn();
        }
      }
    } catch (error) {
      console.error('Proxy: Error decoding accessToken', error);
      // Optional: redirect on malformed token
      // return redirectToSignIn();
    }
  }

  return NextResponse.next();
}

export const config = {
  // Protect all routes except auth-related ones and static assets
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|images|auth/sign-in|auth/sign-up).*)',
  ],
};
