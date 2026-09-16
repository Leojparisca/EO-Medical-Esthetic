import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  // Create a Supabase client configured to use cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // If we're in a middleware, we can't modify cookies directly
          // They will be set via the response
        },
        remove(name: string, options: any) {
          // Same as set - handled via response
        },
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

  // Get the session - validate it properly instead of just checking header presence
  let isAuthenticated = false;
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    isAuthenticated = !!session;
  } catch (error) {
    console.error('Error validating session in middleware:', error);
    isAuthenticated = false;
  }

  // Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users from auth routes to landing
  if (isAuthRoute && isAuthenticated) {
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
