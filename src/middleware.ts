import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Auth routes - redirect to analyzer if already logged in.
 * We check for session cookie to determine if user is logged in.
 */
const authRoutes = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check for NextAuth session cookie (works with database sessions)
  // NextAuth uses different cookie names in production vs development
  const sessionToken = request.cookies.get('__Secure-next-auth.session-token') || 
                       request.cookies.get('next-auth.session-token');
  
  const isLoggedIn = !!sessionToken?.value;
  
  // Check if route is an auth route
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Redirect to analyzer if accessing auth route while logged in
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/analyzer', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Auth routes only - we'll handle /analyzer protection on the page itself
    '/login',
    '/register',
  ],
};
