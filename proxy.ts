import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const protectedRoutes = ['/dashboard', '/doctors', '/patients', '/profile'];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  // if user is not authenticated and attempts to access protected routes, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // if user is already authenticated and visits login page, redirect to dashboard
  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/doctors/:path*',
    '/patients/:path*',
    '/profile/:path*',
    '/login',
  ],
};
