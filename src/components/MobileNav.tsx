"use client"

import * as React from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"

export default function MobileNav() {
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

            <div className="mt-auto">
              <Link
                href="/auth/login"
                onClick={toggleMenu}
                className="block w-full py-3 text-center bg-primary text-primary-foreground rounded-md font-medium"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
