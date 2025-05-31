'use client';
import { useState, useEffect, useCallback } from 'react';
import { type User, type AuthError, type Provider } from '@supabase/supabase-js';
import { getSupabaseClient } from '@/lib/supabase-client';

function useAuthHook() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(0); // Track last refresh time
  
  // Get the Supabase client
  const supabase = getSupabaseClient();

  // Handle authentication errors
  const handleAuthError = useCallback((error: AuthError | Error | null) => {
    if (!error) return;

    console.error('Auth error:', error);

    if (error.message?.includes('refresh_token_not_found')) {
      // Token expired, user needs to sign in again
      setUser(null);
      setError('Session expired. Please sign in again.');
      setIsLoading(false);
    } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
      // Network error, don't clear user
      setError('Network error. Please check your connection.');
      setIsLoading(false);
    } else {
      // Other errors
      setUser(null);
      setError(error.message || 'Authentication error occurred.');
      setIsLoading(false);
    }
  }, []);

  // Initialize auth state - with a flag to prevent multiple initializations
  const initializeAuth = useCallback(async () => {
    if (!supabase) {
      setIsLoading(false);
      setError('Supabase client not available');
      setInitialized(true);
      return;
    }
    
    // Don't initialize if we're already initialized
    if (initialized && !isLoading) {
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        handleAuthError(error);
        return;
      }

      // Only log on first load
      if (!initialized) {
        console.log('Initial auth state:', session ? 'Logged in' : 'Not logged in');
      }
      
      setUser(session?.user || null);
      setIsLoading(false);
      setError(null);
      setInitialized(true);
    } catch (error) {
      console.error('Error during initial auth check:', error);
      handleAuthError(error as Error);
      setInitialized(true);
    }
  }, [supabase, handleAuthError, initialized, isLoading]);

  // Initialize auth state
  useEffect(() => {
    // Only initialize once
    if (!initialized) {
      initializeAuth();
    }
    
    // Don't set up listeners if supabase client is not available
    if (!supabase) return;

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Only log important auth events
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          console.log('Auth state change:', event, session?.user?.email || 'No user');
        }
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            setUser(session.user);
            setError(null);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setError(null);
        } else if (event === 'USER_UPDATED') {
          if (session?.user) {
            setUser(session.user);
          }
        }
        
        setIsLoading(false);
        setInitialized(true);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, initializeAuth]);



  // Sign out function
  const signOut = useCallback(async () => {
    if (!supabase) return { error: 'Supabase client not available' };

    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        handleAuthError(error);
        return { error: error.message };
      }

      // State will be updated by onAuthStateChange
      return { error: null };
    } catch (error) {
      console.error('Error signing out:', error);
      handleAuthError(error as Error);
      return { error: 'Failed to sign out' };
    }
  }, [supabase, handleAuthError]);

  // Sign in with phone number function
  const signInWithPhone = useCallback(async (phone: string) => {
    if (!supabase) return { error: 'Supabase client not available' };

    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          shouldCreateUser: true
        }
      });
      
      if (error) {
        handleAuthError(error);
        return { data: null, error: error.message };
      }

      // State will be updated by onAuthStateChange
      return { data, error: null, message: 'OTP sent to your phone' };
    } catch (error) {
      console.error('Error signing in with phone:', error);
      handleAuthError(error as Error);
      return { data: null, error: 'Failed to sign in with phone' };
    } finally {
      setIsLoading(false);
    }
  }, [supabase, handleAuthError]);
  
  // Verify OTP function
  const verifyOtp = useCallback(async (phone: string, otp: string) => {
    if (!supabase) return { error: 'Supabase client not available' };

    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: 'sms'
      });
      
      if (error) {
        handleAuthError(error);
        return { data: null, error: error.message };
      }

      // State will be updated by onAuthStateChange
      return { data, error: null };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      handleAuthError(error as Error);
      return { data: null, error: 'Failed to verify OTP' };
    } finally {
      setIsLoading(false);
    }
  }, [supabase, handleAuthError]);
  
  // Sign in with social provider function
  const signInWithSocialProvider = useCallback(async (provider: Provider) => {
    if (!supabase) return { error: 'Supabase client not available' };
    
    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`Initiating ${provider} OAuth sign in...`);
      
      // Configure OAuth options based on provider
      const options: any = {
        redirectTo: `${window.location.origin}/auth/callback`
      };
      
      // Add specific configuration for different providers
      if (provider === 'google') {
        // Add scopes for Google to ensure we get profile data
        options.queryParams = {
          access_type: 'offline',
          prompt: 'consent',
          scope: 'profile email'
        };
        console.log('Using enhanced Google OAuth configuration');
      } else if (provider === 'apple') {
        // Apple specific configuration if needed
        options.queryParams = {
          scope: 'name email'
        };
      }
      
      // Initiate OAuth flow
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options
      });
      
      if (error) {
        console.error(`Error during ${provider} OAuth:`, error);
        handleAuthError(error);
        return { data: null, error: error.message };
      }
      
      console.log(`${provider} OAuth initiated successfully, redirecting...`);
      
      // Store the provider in localStorage to handle the callback better
      localStorage.setItem('lastAuthProvider', provider);
      
      return { data, error: null };
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error);
      handleAuthError(error as Error);
      setIsLoading(false);
      return { data: null, error: `Failed to sign in with ${provider}` };
    } finally {
      // We don't set isLoading to false here because we're redirecting to the OAuth provider
      // The loading state will be handled when we return from the OAuth flow
    }
  }, [supabase, handleAuthError]);

  // Get user's initials for avatar
  const getUserInitials = useCallback(() => {
    if (!user) return '';

    // Try to get name from user metadata
    const fullName = user.user_metadata?.full_name || 
                     user.user_metadata?.name || '';

    if (fullName) {
      const nameParts = fullName.trim().split(' ');
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
      }
      return fullName[0].toUpperCase();
    }

    // Fallback to phone or email
    if (user.phone) {
      return 'P';
    } else if (user.email) {
      return user.email[0].toUpperCase();
    }

    return 'U';
  }, [user]);

  // Get user display name
  const getUserDisplayName = useCallback(() => {
    if (!user) return '';

    return user.user_metadata?.full_name || 
           user.user_metadata?.name || 
           user.phone || 
           user.email?.split('@')[0] || 
           'User';
  }, [user]);

  // Refresh session manually with rate limiting
  const refreshSession = useCallback(async () => {
    if (!supabase) return { error: 'Supabase client not available' };

    // Rate limit refreshes to once every 10 seconds
    const now = Date.now();
    const timeSinceLastRefresh = now - lastRefreshTime;
    if (timeSinceLastRefresh < 10000 && initialized) {
      // Skip refresh if we've refreshed recently and already initialized
      return { error: null };
    }

    try {
      setIsLoading(true);
      setError(null);
      setLastRefreshTime(now);
      
      // First try to get the current session without refreshing
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Error getting session:', sessionError.message);
        handleAuthError(sessionError);
        setIsLoading(false);
        return { error: sessionError.message };
      }
      
      // If we already have a session, use it
      if (sessionData.session) {
        const currentUser = sessionData.session.user;
        
        // Only log if the user is different than the current one
        if (!user || user.id !== currentUser.id) {
          const userIdentifier = currentUser.phone || currentUser.email;
          console.log("Session found for user:", userIdentifier);
        }
        
        // For Google login, ensure we have the latest user metadata
        if (currentUser.app_metadata?.provider === 'google' && currentUser.email) {
          console.log('Google user data in refreshSession:', {
            email: currentUser.email,
            name: currentUser.user_metadata?.full_name || currentUser.user_metadata?.name,
            avatar: currentUser.user_metadata?.avatar_url
          });
          
          // If we don't have user metadata but have an email, try to get user data
          if (!currentUser.user_metadata?.full_name || !currentUser.user_metadata?.avatar_url) {
            console.log('Missing Google user metadata, fetching user details...');
            const { data: userData } = await supabase.auth.getUser();
            if (userData?.user) {
              setUser(userData.user);
              console.log('Updated user data from getUser():', userData.user);
              setIsLoading(false);
              return { error: null };
            }
          }
        }
        
        setUser(currentUser);
        setIsLoading(false);
        return { error: null };
      }
      
      // Only try to refresh if we don't have a session
      try {
        const { data, error } = await supabase.auth.refreshSession();
        
        if (error) {
          // If we get an AuthSessionMissingError, it just means the user isn't logged in
          // This is not a real error in most cases
          if (error.message.includes('Auth session missing')) {
            setUser(null);
            setIsLoading(false);
            return { error: null };
          }
          
          handleAuthError(error);
          return { error: error.message };
        }

        if (data.session) {
          const refreshedUser = data.session.user;
          setUser(refreshedUser);
          
          // For Google login, dispatch an event to notify components
          if (refreshedUser.app_metadata?.provider === 'google') {
            window.dispatchEvent(new CustomEvent('supabase-user-signed-in', { 
              detail: { provider: 'google', user: refreshedUser }
            }));
          }
        }

      } catch (refreshError) {
        // Handle refresh errors silently if they're just about missing session
        if (refreshError instanceof Error && 
            refreshError.message.includes('Auth session missing')) {
          console.log("No active session to refresh");
        } else {
          console.error('Error during session refresh:', refreshError);
          handleAuthError(refreshError as Error);
        }
      }

      setIsLoading(false);
      return { error: null };
    } catch (error) {
      console.error('Error in refresh session flow:', error);
      handleAuthError(error as Error);
      setIsLoading(false);
      return { error: 'Failed to refresh session' };
    }
  }, [supabase, handleAuthError]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Check if user is authenticated
  const isAuthenticated = !!user && !isLoading;

  return {
    user,
    isLoading,
    error,
    signInWithPhone,
    verifyOtp,
    signInWithSocialProvider,
    signOut,
    refreshSession,
    getUserInitials,
    getUserDisplayName,
    isAuthenticated,
    clearError,
    supabase
  };
}

export const useAuth = useAuthHook;