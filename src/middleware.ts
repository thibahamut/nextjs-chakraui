import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function getTokenFromCookie(request: NextRequest) {
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/sb-access-token=([^;]+)/);
  return match ? match[1] : null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // Always allow access to home page
  if (pathname === '/') {
    return NextResponse.next()
  }

  // Check if user has authentication token
  const token = getTokenFromCookie(request)
  const isLoggedIn = !!token

  // Handle /auth routes
  if (pathname.startsWith('/auth')) {
    // If user is logged in, redirect to /app
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/app', request.url))
    }
    // If not logged in, allow access to auth pages
    return NextResponse.next()
  }

  // Handle /app routes
  if (pathname.startsWith('/app')) {
    // If user is not logged in, redirect to home
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    // If logged in, allow access
    return NextResponse.next()
  }

  // For any other protected routes, redirect to home if not logged in
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
} 