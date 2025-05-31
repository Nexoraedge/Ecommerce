import { createBrowserClient } from '@supabase/ssr';
import { type SupabaseClient } from '@supabase/supabase-js';

// Create a singleton Supabase client to be reused across the app
let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient() {
  if (!supabaseInstance && typeof window !== 'undefined') {
    // Validate environment variables
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!url || !key) {
      console.error('Missing Supabase environment variables');
      return null;
    }
    
    try {
      // Create the Supabase client with proper configuration
      supabaseInstance = createBrowserClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: 'pkce'
        }
      });
      
      console.log('Supabase client initialized for phone and social auth');
      
      // Set up auth state change listener
      supabaseInstance.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Log user identifier and fetch additional user data if needed
          const userIdentifier = session.user.phone || session.user.email;
          console.log('Auth state change - SIGNED_IN:', userIdentifier);
          
          // For Google login, ensure we have user metadata
          if (session.user.app_metadata?.provider === 'google' && session.user.email) {
            console.log('Google auth detected, user data available:', {
              email: session.user.email,
              name: session.user.user_metadata?.full_name,
              avatar: session.user.user_metadata?.avatar_url
            });
            
            // Dispatch an event to notify components that user data is available
            window.dispatchEvent(new CustomEvent('supabase-user-signed-in', { 
              detail: { provider: 'google', user: session.user }
            }));
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('Auth state change - SIGNED_OUT');
          window.dispatchEvent(new CustomEvent('supabase-user-signed-out'));
        }
      });
      
      // Check if we have a session immediately
      supabaseInstance.auth.getSession().then(({ data, error }) => {
        if (error) {
          console.error('Error getting session:', error.message);
          return;
        }
        
        if (data.session) {
          // Log user identifier (could be phone or email from social provider)
          const userIdentifier = data.session.user.phone || data.session.user.email;
          console.log('Initial session found for:', userIdentifier);
          
          // For Google login, log available user data
          if (data.session.user.app_metadata?.provider === 'google') {
            console.log('Google user data:', data.session.user.user_metadata);
            
            // Dispatch an event to notify components that user data is available
            window.dispatchEvent(new CustomEvent('supabase-user-signed-in', { 
              detail: { provider: 'google', user: data.session.user }
            }));
          }
        } else {
          console.log('No initial session found');
        }
      });
    } catch (error) {
      console.error('Error initializing Supabase client:', error);
      return null;
    }
  }
  return supabaseInstance;
}
