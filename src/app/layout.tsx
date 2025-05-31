import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/components/auth-provider';
import CartDrawer from '@/components/cart/CartDrawer';
import CartButton from '@/components/cart/CartButton';
import ThemeToggle from '@/components/ThemeToggle';
import MobileNav from '@/components/MobileNav';
import UserProfileNav from '@/components/UserProfileNav';
import SearchBar from '@/components/SearchBar';
import ReportBugButton from '@/components/ReportBugButton';
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
              <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-500/20">
                <div className="container flex h-16 min-h-[64px] items-center justify-between px-4 md:px-6">
                  {/* Logo */}
                  <Link className="flex items-center space-x-3" href="/">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img 
                        src="https://picsum.photos/200" 
                        alt="Logo" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-bold max-sm:hidden text-xl">
                      E-Commerce
                    </span>
                  </Link>
                  
                  {/* Desktop Navigation */}
                  <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                    <div className="relative group">
                      <Link
                        className="transition-colors hover:text-foreground/80 flex items-center"
                        href="/categories"
                      >
                        Categories
                      </Link>
                      <div className="absolute left-0 top-full pt-2 opacity-0 rounded-lg border-[1px] invisible group-hover:opacity-100  bg-gray-700/60 group-hover:visible transition-all duration-200">
                        <div className="  shadow-lg py-2 w-48">
                          <Link
                            href="/categories/men"
                            className="block px-4 py-2 hover:bg-muted   text-white"
                          >
                            Men
                          </Link>
                          <Link
                            href="/categories/women"
                            className="block px-4 py-2 hover:bg-muted  text-white"
                          >
                            Women
                          </Link>
                          <Link
                            href="/categories/kids"
                            className="block px-4 py-2 hover:bg-muted  text-white"
                          >
                            Kids
                          </Link>
                          <Link
                            href="/categories/accessories"
                            className="block px-4 py-2 hover:bg-muted  text-white"
                          >
                            Accessories
                          </Link>
                        </div>
                      </div>
                    </div>
                    <Link
                      className="transition-colors hover:text-foreground/80"
                      href="/products"
                    >
                      All Products
                    </Link>
                    <Link
                      className="transition-colors hover:text-foreground/80"
                      href="/about"
                    >
                      About
                    </Link>
                  </nav>
                  
                  {/* Right side controls */}
                  <div className="flex items-center space-x-4">
                    <SearchBar />
                    <ThemeToggle />
                    <CartButton />
                    <UserProfileNav />
                    <div className="md:hidden">
                      <MobileNav />
                    </div>
                  </div>
                </div>
              </header>
              <main>{children}</main>
              <CartDrawer />
              <ReportBugButton />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
