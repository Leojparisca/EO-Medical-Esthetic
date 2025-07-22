import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export function middleware(request: NextRequest) {
  // Create a Supabase client configured to use cookies
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: 'pkce',
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false,
      },
    }
  );

  // Protected routes that require authentication
  const protectedRoutes = ['/landing', '/profile', '/booking', '/medical-history'];
  const authRoutes = ['/login', '/signup'];
  
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  // Get the session from the request headers
  const authHeader = request.headers.get('authorization');
  const hasValidSession = authHeader && authHeader.startsWith('Bearer ');

  // Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !hasValidSession) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users from auth routes to landing
  if (isAuthRoute && hasValidSession) {
    const landingUrl = new URL('/landing', request.url);
    return NextResponse.redirect(landingUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - El resto de assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\..*).*)',
  ],
};
