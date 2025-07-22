import { NextResponse, type NextRequest } from 'next/server';

// El middleware ya no es necesario ya que no hay autenticación.
// Se devuelve una respuesta simple.
export function middleware(request: NextRequest) {
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
