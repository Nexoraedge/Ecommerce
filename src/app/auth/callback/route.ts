import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const next = requestUrl.searchParams.get('next');
    const type = requestUrl.searchParams.get('type');

    if (code) {
      const supabase = createRouteHandlerClient({ cookies });
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Auth error:', error);
        return NextResponse.redirect(
          new URL('/auth/signin?error=auth', request.url)
        );
      }

      // For password reset flow
      if (type === 'recovery') {
        return NextResponse.redirect(
          new URL('/auth/reset-password', request.url)
        );
      }

      // For normal sign in flow
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return NextResponse.redirect(
          new URL('/auth/signin?error=session', request.url)
        );
      }
    }

    // Successful authentication, redirect to dashboard or specified page
    return NextResponse.redirect(
      new URL(next || '/dashboard', request.url)
    );
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(
      new URL('/auth/signin?error=unknown', request.url)
    );
  }
}