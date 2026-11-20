import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// protected routes
const protectedRoutes = ['/dashboard', '/doctors', '/patients', '/profile'];

export function proxy(request: NextRequest) {
  const rawToken = request.cookies.get('token')?.value?.trim();
  const hasToken = !!rawToken && rawToken !== 'null' && rawToken !== 'undefined' && rawToken.length > 10;
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  const isLoginPage = pathname === '/login';

  // root route redirect
  if (pathname === '/') {
    return NextResponse.redirect(new URL(hasToken ? '/dashboard' : '/login', request.url));
  }

  // unauthenticated guard: redirect directly to /login
  if (isProtectedRoute && !hasToken) {
    const loginUrl = new URL('/login', request.url);
    if (pathname !== '/dashboard') {
      loginUrl.searchParams.set('from', pathname);
    }
    const response = NextResponse.redirect(loginUrl);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    return response;
  }

  // authenticated visitor redirect to /dashboard
  if (isLoginPage && hasToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // security no-cache headers
  const response = NextResponse.next();
  if (isProtectedRoute) {
    response.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
  }

  return response;
}

export { proxy as middleware };
export default proxy;

export const config = {
  matcher: [
    '/',
    '/dashboard',
    '/dashboard/:path*',
    '/doctors',
    '/doctors/:path*',
    '/patients',
    '/patients/:path*',
    '/profile',
    '/profile/:path*',
    '/login',
  ],
};
