import { SupabaseClient } from '@supabase/supabase-js';

// Google login functionality has been removed

/**
 * Performs a complete sign out, clearing all auth state
 */
export async function forceCompleteSignOut(supabase: SupabaseClient) {
  try {
    // First, sign out from Supabase
    await supabase.auth.signOut({ scope: 'global' });
    
    // Clear all browser storage
    if (typeof window !== 'undefined') {
      // Clear specific Supabase items
      const supabaseKeys = [
        'supabase.auth.token',
        'supabase.auth.refreshToken',
        'supabase.auth.accessToken',
        'sb-refresh-token',
        'sb-access-token',
        'sb-auth-token',
        'supabase-auth-token'
      ];
      
      // Remove specific keys
      supabaseKeys.forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
      
      // Find and remove any other Supabase-related items
      const lsKeysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('supabase') || key.includes('sb-'))) {
          lsKeysToRemove.push(key);
        }
      }
      lsKeysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Clear cookies related to authentication
      const cookiesToClear = ['sb-access-token', 'sb-refresh-token', 'supabase-auth-token'];
      cookiesToClear.forEach(name => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}; secure;`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error in forceCompleteSignOut:', error);
    return false;
  }
}

/**
 * Utility function to clear all authentication state when errors occur
 */
export async function clearAuthState(supabase: SupabaseClient) {
  await forceCompleteSignOut(supabase);
  
  // Force a page reload to clear any in-memory state
  if (typeof window !== 'undefined') {
    // Add a small delay to ensure all cleanup operations complete
    setTimeout(() => {
      window.location.href = '/auth/signin';
    }, 100);
  }
  
  return true;
}
