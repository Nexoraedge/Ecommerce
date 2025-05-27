'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Icons } from '@/components/ui/icons';
import supabase from '@/lib/supabase';

export function Navbar() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/auth/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link 
              href="/dashboard" 
              className="flex items-center space-x-2 text-primary hover:text-primary/90 transition-colors"
            >
              <Icons.store className="h-6 w-6" />
              <span className="font-bold text-lg hidden sm:inline-block">E-Commerce Dashboard</span>
            </Link>
          </div>
          <nav className="flex items-center space-x-4">
            <button
              onClick={handleSignOut}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
            >
              <Icons.logout className="mr-2 h-4 w-4" />
              Sign Out
            </button>
          </nav>
        </div>
      </div>
    </motion.header>
  );
}
