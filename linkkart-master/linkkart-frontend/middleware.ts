import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Basic route protection: if trying to access dashboard/onboarding and no access or refresh token,
  // redirect to login. This prevents flash of unauthenticated content.
  const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/onboarding');
  
  if (isProtectedRoute) {
    const hasAccessToken = request.cookies.has('access_token');
    const hasRefreshToken = request.cookies.has('refresh_token');
    
    if (!hasAccessToken && !hasRefreshToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/onboarding/:path*'],
};
