import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the token from cookies
  const token = request.cookies.get('token')?.value

  // Define protected paths that require authentication
  const protectedPaths = [
    '/customer/dashboard',
    '/customer/companies',
    '/customer/drivers',
    '/customer/vehicles',
    '/customer/billing',
    '/admin/dashboard',
    '/admin/customers',
    '/admin/access-control',
    '/admin/access-control/reports',
    '/admin/billing',
    '/admin/billing/reports',
    '/admin/billing/settings',
    '/admin/wasl/companies',
    '/admin/wasl/drivers',
    '/admin/wasl/vehicles',
  ]

  // Check if the current path is protected
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  // If it's a protected path and there's no token, redirect to login
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If user is already logged in and tries to access login/register page, redirect to dashboard
  if (token && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')) {
    return NextResponse.redirect(new URL('/customer/dashboard', request.url))
  }

  return NextResponse.next()
}

// Configure which paths the middleware will run on
export const config = {
  matcher: [
    '/customer/:path*',
    '/admin/:path*',
    '/login',
    '/register'
  ]
} 