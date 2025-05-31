import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = requestUrl.searchParams.get('next') || '/'
    const type = requestUrl.searchParams.get('type')
    const error = requestUrl.searchParams.get('error')
    const errorDescription = requestUrl.searchParams.get('error_description')

    // If there's an error in the OAuth callback, handle it
    if (error) {
      console.error('OAuth error:', error, errorDescription)
      
      const response = NextResponse.redirect(
        new URL(`${process.env.NEXT_PUBLIC_APP_URL}/auth/signin?error=${encodeURIComponent(error)}&error_description=${encodeURIComponent(errorDescription || '')}&t=${Date.now()}`, request.url)
      )
      
      // Clear auth cookies on error
      clearAuthCookies(response)
      return response
    }

    // If we have a code, try to exchange it for a session
    if (code) {
      const cookieStore = await cookies()
      
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return cookieStore.get(name)?.value
            },
            set(name: string, value: string, options: any = {}) {
              try {
                cookieStore.set({
                  name,
                  value,
                  ...options,
                  httpOnly: true,
                  secure: process.env.NODE_ENV === 'production',
                  sameSite: 'lax',
                  path: '/',
                })
              } catch (error) {
                // Handle cookie setting errors gracefully
                console.warn('Failed to set cookie:', name, error)
              }
            },
            remove(name: string, options: any = {}) {
              try {
                cookieStore.set({
                  name,
                  value: '',
                  maxAge: 0,
                  ...options,
                  httpOnly: true,
                  secure: process.env.NODE_ENV === 'production',
                  sameSite: 'lax',
                  path: '/',
                })
              } catch (error) {
                console.warn('Failed to remove cookie:', name, error)
              }
            },
          },
        }
      )

      try {
        // Exchange the code for a session
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

        if (exchangeError) {
          console.error('Auth exchange error:', exchangeError)
          return NextResponse.redirect(
            new URL(`${process.env.NEXT_PUBLIC_APP_URL}/auth/signin?error=${encodeURIComponent(exchangeError.message)}&t=${Date.now()}`, request.url)
          )
        }

        // For password reset flow
        if (type === 'recovery') {
          return NextResponse.redirect(
            new URL(`${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`, request.url)
          )
        }

        // Verify we have a valid session
        if (!data.session || !data.user) {
          console.error('No session or user after successful code exchange')
          return NextResponse.redirect(
            new URL(`${process.env.NEXT_PUBLIC_APP_URL}/auth/signin?error=missing_session&t=${Date.now()}`, request.url)
          )
        }
        
        // Log successful authentication
        console.log('Authentication successful for user:', data.user.email)

        // Create response and set proper headers
        const response = NextResponse.redirect(new URL(next, request.url))
        
        // Set a custom cookie to help with session detection
        response.cookies.set({
          name: 'auth-session-active',
          value: 'true',
          httpOnly: false, // Allow JS access
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 7, // 1 week
          path: '/',
          sameSite: 'lax'
        })
        
        // Refresh the page to ensure auth state is updated
        response.headers.set('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate')
        
        return response

      } catch (exchangeError: any) {
        console.error('Code exchange error:', exchangeError)
        
        const errorResponse = NextResponse.redirect(
          new URL(`${process.env.NEXT_PUBLIC_APP_URL}/auth/signin?error=exchange_error&details=${encodeURIComponent(exchangeError.message)}&t=${Date.now()}`, request.url)
        )
        
        clearAuthCookies(errorResponse)
        return errorResponse
      }
    }

    // If we get here without a code, redirect to the sign-in page
    return NextResponse.redirect(
      new URL(`${process.env.NEXT_PUBLIC_APP_URL}/auth/signin?error=missing_code&t=${Date.now()}`, request.url)
    )
    
  } catch (error: any) {
    console.error('Callback error:', error)
    return NextResponse.redirect(
      new URL(`${process.env.NEXT_PUBLIC_APP_URL}/auth/signin?error=${encodeURIComponent(error.message || 'unknown')}&t=${Date.now()}`, request.url)
    )
  }
}

// Helper function to clear auth cookies
function clearAuthCookies(response: NextResponse) {
  const cookiesToClear = [
    'sb-access-token',
    'sb-refresh-token', 
    'supabase-auth-token',
    'sb-provider-token',
    '__session',
    // Add common Supabase cookie patterns
    'sb:token',
    'supabase.auth.token'
  ]

  cookiesToClear.forEach(cookieName => {
    response.cookies.set(cookieName, '', {
      maxAge: 0,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax'
    })
  })

  return response
}