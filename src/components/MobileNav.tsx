"use client"

import * as React from "react"
import { Menu, X, User, LogOut } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"

export default function MobileNav() {
  const { user, signOut, getUserInitials } = useAuth()
  const [isOpen, setIsOpen] = React.useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (isOpen && !(event.target as Element).closest('.mobile-menu-container')) {
        setIsOpen(false)
      }
    }

    document.addEventListener('click', handleOutsideClick)
    return () => document.removeEventListener('click', handleOutsideClick)
  }, [isOpen])

  // Prevent scrolling when menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  return (
    <div className="mobile-menu-container">
      <button
        onClick={toggleMenu}
        className="p-2 text-foreground rounded-md hover:bg-muted"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background">
          <div className="flex flex-col h-full p-6">
            <div className="flex justify-end mb-8">
              <button
                onClick={toggleMenu}
                className="p-2 text-foreground rounded-md hover:bg-muted"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex flex-col space-y-6 text-lg font-medium">
              <Link
                href="/"
                onClick={toggleMenu}
                className="py-2 border-b border-border"
              >
                Home
              </Link>
              <Link
                href="/categories"
                onClick={toggleMenu}
                className="py-2 border-b border-border"
              >
                Categories
              </Link>
              <Link
                href="/products"
                onClick={toggleMenu}
                className="py-2 border-b border-border"
              >
                All Products
              </Link>
              <Link
                href="/about"
                onClick={toggleMenu}
                className="py-2 border-b border-border"
              >
                About
              </Link>
            </nav>

            <div className="mt-auto space-y-4">
              {user ? (
                <>
                  <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-md">
                    <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium overflow-hidden">
                      {user.user_metadata?.avatar_url ? (
                        <img 
                          src={user.user_metadata.avatar_url} 
                          alt="User avatar" 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span>{getUserInitials()}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {user.user_metadata?.full_name || user.user_metadata?.name || user.email}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Link
                      href="/account"
                      onClick={toggleMenu}
                      className="flex items-center space-x-2 w-full p-3 bg-muted/30 rounded-md"
                    >
                      <User className="h-4 w-4" />
                      <span>My Account</span>
                    </Link>
                    
                    <button
                      onClick={() => {
                        signOut()
                        toggleMenu()
                      }}
                      className="flex items-center space-x-2 w-full p-3 bg-muted/30 rounded-md text-red-600 dark:text-red-400"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    onClick={toggleMenu}
                    className="block w-full py-3 text-center bg-primary text-primary-foreground rounded-md font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={toggleMenu}
                    className="block w-full py-3 text-center bg-muted border border-border rounded-md font-medium"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
