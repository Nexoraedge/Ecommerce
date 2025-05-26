import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold">Welcome to Dashboard</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        You are signed in as: {session.user.email}
      </p>
      <div className="mt-8">
        <button
          className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = '/';
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}