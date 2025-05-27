import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/components/auth-provider';
import CartDrawer from '@/components/cart/CartDrawer';
import CartButton from '@/components/cart/CartButton';
import ThemeToggle from '@/components/ThemeToggle';
import MobileNav from '@/components/MobileNav';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'E-Commerce Platform',
  description: 'Modern e-commerce platform with Next.js and Supabase',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="min-h-screen bg-background">
              <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                  {/* Logo */}
                  <a className="flex items-center space-x-2" href="/">
                    <span className="font-bold text-xl">
                      E-Commerce
                    </span>
                  </a>
                  
                  {/* Desktop Navigation */}
                  <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                    <div className="relative group">
                      <a
                        className="transition-colors hover:text-foreground/80 flex items-center"
                        href="/categories"
                      >
                        Categories
                      </a>
                      <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <div className="bg-card dark:bg-card shadow-lg rounded-lg py-2 w-48">
                          <a
                            href="/categories/men"
                            className="block px-4 py-2 hover:bg-muted text-foreground"
                          >
                            Men
                          </a>
                          <a
                            href="/categories/women"
                            className="block px-4 py-2 hover:bg-muted text-foreground"
                          >
                            Women
                          </a>
                          <a
                            href="/categories/kids"
                            className="block px-4 py-2 hover:bg-muted text-foreground"
                          >
                            Kids
                          </a>
                        </div>
                      </div>
                    </div>
                    <a
                      className="transition-colors hover:text-foreground/80"
                      href="/products"
                    >
                      All Products
                    </a>
                    <a
                      className="transition-colors hover:text-foreground/80"
                      href="/about"
                    >
                      About
                    </a>
                  </nav>
                  
                  {/* Right side controls */}
                  <div className="flex items-center space-x-4">
                    <ThemeToggle />
                    <CartButton />
                    <div className="md:hidden">
                      <MobileNav />
                    </div>
                  </div>
                </div>
              </header>
              <main>{children}</main>
              <CartDrawer />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
