import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'

// Define role hierarchy
const ROLE_HIERARCHY = {
  'super_admin': 4,
  'admin': 3,
  'manager': 2,
  'dn': 1,
  'user': 0
} as const

type UserRole = keyof typeof ROLE_HIERARCHY

// Define route permissions
const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  '/app/admin': ['super_admin', 'admin'],
  '/app/management': ['super_admin', 'admin', 'manager'],
  '/app/settings': ['super_admin', 'admin'],
}

function getTokenFromCookie(request: NextRequest) {
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/sb-access-token=([^;]+)/);
  return match ? match[1] : null;
}

async function getUserRole(token: string): Promise<UserRole | null> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return null
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userError || !userData) {
      return null
    }

    return userData.role as UserRole
  } catch (error) {
    console.error('Error fetching user role:', error)
    return null
  }
}

function hasRequiredRole(userRole: UserRole | null, requiredRoles: UserRole[]): boolean {
  if (!userRole) return false
  return requiredRoles.includes(userRole)
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
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/app', request.url))
    }
    return NextResponse.next()
  }

  // Handle /app routes
  if (pathname.startsWith('/app')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Check role-based access for specific routes
    const userRole = await getUserRole(token!)
    
    // Check if the current path requires specific role permissions
    for (const [route, requiredRoles] of Object.entries(ROUTE_PERMISSIONS)) {
      if (pathname.startsWith(route) && !hasRequiredRole(userRole, requiredRoles as UserRole[])) {
        return NextResponse.redirect(new URL('/app', request.url))
      }
    }

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