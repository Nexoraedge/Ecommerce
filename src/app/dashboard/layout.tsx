import { ReactNode } from 'react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value || '';
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  // Convert complex objects to plain objects before passing
  const plainSession = session ? { ...session } : null;
  
  if (!plainSession) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <a className="mr-6 flex items-center space-x-2" href="/dashboard">
              <span className="font-bold">E-Commerce Dashboard</span>
            </a>
          </div>
          <nav className="flex flex-1 items-center justify-end space-x-4">
            <form
              action={async () => {
                'use server';
                await supabase.auth.signOut();
                redirect('/auth/signin');
              }}
            >
              // Convert button to a client component
              'use client';
              <button
                type="submit"
                className="text-sm font-medium text-muted-foreground hover:text-primary"
                onClick={() => {
                  // Handle click event
                }}
              >
                Sign Out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}