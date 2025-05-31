'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

export default function UserProfileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [stableHeight, setStableHeight] = useState<string>('h-16'); // Fixed height for navbar
  const router = useRouter();
  const { user, isLoading, signOut, isAuthenticated, refreshSession } = useAuth();
  const navRef = useRef<HTMLDivElement>(null);
  const initialLoadRef = useRef<boolean>(true);

  // For debugging - but only log when something important changes
  useEffect(() => {
    // Only log if we have a user and authentication state has changed
    if (user && !isLoading) {
      console.log('UserProfileNav - User authenticated:', user.phone || user.email);
      
      // If we have Google user data, log it
      if (user.app_metadata?.provider === 'google') {
        console.log('Google user data in UserProfileNav:', {
          email: user.email,
          name: user.user_metadata?.full_name,
          avatar: user.user_metadata?.avatar_url
        });
      }
    }
  }, [user, isLoading]);

  // Stabilize the navbar height to prevent layout shifts
  useEffect(() => {
    if (navRef.current && initialLoadRef.current) {
      // Set a fixed height after initial render
      const height = navRef.current.offsetHeight;
      if (height > 0) {
        setStableHeight(`h-[${height}px]`);
        initialLoadRef.current = false;
      }
    }
  }, []);

  // Memoized debounce function to prevent multiple rapid calls
  const debounce = useCallback((func: Function, wait: number) => {
    let timeout: NodeJS.Timeout | null = null;
    return (...args: any[]) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        func(...args);
      }, wait);
    };
  }, []);

  // Create a debounced refresh function
  const debouncedRefresh = useCallback(
    debounce(() => {
      refreshSession();
    }, 300),
    [refreshSession]
  );

  // Listen for auth events from supabase client
  useEffect(() => {
    const handleUserSignedIn = (event: Event) => {
      console.log('UserProfileNav received sign-in event');
      console.log('UserProfileNav received sign-in event', event);
      refreshSession();
    };
    
    const handleUserSignedOut = (event: Event) => {
      console.log('UserProfileNav received sign-out event');
      refreshSession();
    };

    // Add event listeners
    window.addEventListener('supabase-user-signed-in', handleUserSignedIn as EventListener);
    window.addEventListener('supabase-user-signed-out', handleUserSignedOut as EventListener);

    return () => {
      // Remove event listeners
      window.removeEventListener('supabase-user-signed-in', handleUserSignedIn as EventListener);
      window.removeEventListener('supabase-user-signed-out', handleUserSignedOut as EventListener);
    };
  }, [refreshSession]);

  // Optimized session refresh logic
  useEffect(() => {
    // Only refresh once on mount
    if (!user && !isLoading) {
      refreshSession();
    }
    
    // Check if we're coming back from an OAuth redirect
    const url = new URL(window.location.href);
    const isAuthCallback = url.pathname.includes('/auth/callback');
    const hasAuthCode = url.searchParams.has('code');
    
    // Only refresh if we're coming from an auth callback
    if ((isAuthCallback || hasAuthCode) && !user) {
      // Use a small timeout to allow other auth processes to complete first
      const timer = setTimeout(() => refreshSession(), 500);
      return () => clearTimeout(timer);
    }
    
    // More efficient storage event listener
    const handleStorageChange = (event: StorageEvent) => {
      // Only respond to relevant auth storage changes
      if ((event.key?.includes('supabase') || event.key?.includes('sb-')) && 
          event.newValue !== event.oldValue) {
        debouncedRefresh();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [refreshSession, debouncedRefresh, user, isLoading]);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    router.push('/');
  };

  // Function to get user initials
  const getInitials = () => {
    if (!user) return 'U';
    
    // Fallback to phone or email
    if (user.phone) {
      return 'P';
    } else if (user.email) {
      return user.email[0].toUpperCase();
    }

    return 'U';
  };

  // Function to get user display name
  const getDisplayName = () => {
    if (!user) return '';

    return user.user_metadata?.full_name || 
           user.user_metadata?.name || 
           user.phone ||
           user.email?.split('@')[0] || 
           'User';
  };
  console.log(user);
  

  // Render a container with fixed height to prevent layout shifts
  return (
    <div ref={navRef} className={`flex items-center min-h-[40px] ${stableHeight}`}>
      {isLoading ? (
        // Loading state with same dimensions as the actual content
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
        </div>
      ) : !isAuthenticated ? (
        // Not logged in - show sign in/sign up buttons
        <div className="flex items-center gap-4">
          <Link 
            href="/auth/signin" 
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Sign In
          </Link>
          <Link 
            href="/auth/signup" 
            className="text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
          >
            Sign Up
          </Link>
        </div>
      ) : (
        // Logged in - show profile dropdown with animation
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="User profile"
            aria-expanded={isOpen}
          >
            {user?.user_metadata?.avatar_url ? (
              <img 
                src={user.user_metadata.avatar_url} 
                alt="User avatar" 
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium">{getInitials()}</span>
            )}
          </button>

          {/* Dropdown menu with animation */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-56 rounded-md bg-background border shadow-lg z-50"
                role="menu"
                aria-orientation="vertical"
              >
                <div className="py-2 px-3 text-white border-b bg-gray-700/60">
                  <p className="text-sm font-medium">{getDisplayName()}</p>
                  <p className="text-xs text-white">{user?.phone || user?.email}</p>
                </div>
                <div className="py-1 text-white bg-gray-700/60">
                  <Link 
                    href="/profile" 
                    className="block px-4 py-2 text-sm hover:bg-muted"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link 
                    href="/orders" 
                    className="block px-4 py-2 text-sm hover:bg-muted"
                    onClick={() => setIsOpen(false)}
                  >
                    Orders
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-muted"
                  >
                    Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
