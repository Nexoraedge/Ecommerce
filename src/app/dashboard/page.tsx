"use client";

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth/signin');
      } else {
        setEmail(session.user?.email || null);
      }
    };

    checkSession();
  }, [router, supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/signin');
  };

  if (!email) {
    return null;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold">Welcome to Dashboard</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        You are signed in as: {email}
      </p>
      <div className="mt-8">
        <button
          className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}