'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, LogIn, UserPlus, LogOut, ShoppingBag, Heart, Settings } from 'lucide-react';
import useAuth from '@/hooks/useAuth';

export default function UserProfileNav() {
  const { user, isLoading, getUserInitials, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  // Handle sign out
  const handleSignOut = async () => {
    await signOut();
    closeDropdown();
  };

  if (isLoading) {
    return (
      <div className="h-9 w-9 rounded-full bg-muted animate-pulse"></div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center space-x-1">
        <Link 
          href="/auth/signin" 
          className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
        >
          <LogIn className="h-4 w-4 mr-1.5" />
          <span className="hidden sm:inline">Sign In</span>
        </Link>
        <Link 
          href="/auth/signup" 
          className="flex items-center px-3 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <UserPlus className="h-4 w-4 mr-1.5" />
          <span className="hidden sm:inline">Sign Up</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-center h-9 w-9 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors focus:outline-none"
        aria-label="User menu"
      >
        {user.user_metadata?.avatar_url ? (
          <img 
            src={user.user_metadata.avatar_url} 
            alt="User avatar" 
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <span className="font-medium text-sm">{getUserInitials()}</span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div 
            className="fixed inset-0 z-40 lg:hidden" 
            onClick={closeDropdown}
          ></div>
          
          {/* Dropdown menu */}
          <div className="absolute right-0 mt-2 w-56 rounded-md border border-border bg-card shadow-lg z-50">
            <div className="p-3 border-b border-border">
              <div className="font-medium">{user.user_metadata?.full_name || user.user_metadata?.name || user.email}</div>
              <div className="text-xs text-muted-foreground truncate">{user.email}</div>
            </div>
            
            <div className="py-1">
              <Link 
                href="/account" 
                className="flex items-center px-4 py-2 text-sm hover:bg-muted transition-colors"
                onClick={closeDropdown}
              >
                <User className="h-4 w-4 mr-2" />
                My Account
              </Link>
              <Link 
                href="/orders" 
                className="flex items-center px-4 py-2 text-sm hover:bg-muted transition-colors"
                onClick={closeDropdown}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                My Orders
              </Link>
              <Link 
                href="/wishlist" 
                className="flex items-center px-4 py-2 text-sm hover:bg-muted transition-colors"
                onClick={closeDropdown}
              >
                <Heart className="h-4 w-4 mr-2" />
                Wishlist
              </Link>
              <Link 
                href="/account/settings" 
                className="flex items-center px-4 py-2 text-sm hover:bg-muted transition-colors"
                onClick={closeDropdown}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </div>
            
            <div className="py-1 border-t border-border">
              <button 
                onClick={handleSignOut}
                className="flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-muted transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
