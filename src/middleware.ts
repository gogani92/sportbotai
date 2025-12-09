import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Auth routes - redirect to analyzer if already logged in.
 */
const authRoutes = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get JWT token (works with jwt session strategy)
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  const isLoggedIn = !!token;
  
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
    '/login',
    '/register',
  ],
};
