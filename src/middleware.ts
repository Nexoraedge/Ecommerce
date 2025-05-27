import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options: any) {
            response.cookies.set({
              name,
              value: '',
              ...options,
            });
          },
        },
      }
    );

    // Refresh session and get current session data
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Auth error:', error);
      return response;
    }

    // Handle authentication for protected routes
    const isAuthRoute = request.nextUrl.pathname.startsWith('/auth');
    const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard');

    if (isDashboardRoute && !session) {
      // Save the original URL to redirect back after login
      const redirectUrl = new URL('/auth/signin', request.url);
      redirectUrl.searchParams.set('next', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    if (isAuthRoute && session) {
      // Get the intended destination or default to dashboard
      const next = request.nextUrl.searchParams.get('next') || '/dashboard';
      return NextResponse.redirect(new URL(next, request.url));
    }

    return response;
  } catch (e) {
    console.error('Middleware error:', e);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with specific extensions
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/((?!\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};