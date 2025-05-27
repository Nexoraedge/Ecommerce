import { ReactNode } from 'react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Navbar } from '@/components/ui/navbar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          try {
            const cookieStore = cookies();
            return cookieStore.get(name)?.value ?? '';
          } catch (error) {
            console.error('Error getting cookie:', error);
            return '';
          }
        },
        set(name: string, value: string, options: any) {
          // This is handled by the middleware
        },
        remove(name: string, options: any) {
          // This is handled by the middleware
        },
      },
    }
  );

  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      redirect('/auth/signin');
    }

    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    );
  } catch (error) {
    console.error('Session error:', error);
    redirect('/auth/signin');
  }
}