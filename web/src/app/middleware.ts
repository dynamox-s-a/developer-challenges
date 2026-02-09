import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const cookieName = 'user'
  const sessionToken = request.cookies.get(cookieName)?.value

  const protectedRoutes = ['/dashboard', '/profile']
  const currentPath = request.nextUrl.pathname

  if (protectedRoutes.includes(currentPath) && !sessionToken) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', currentPath)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}
