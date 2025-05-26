import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
        aria-hidden="true"
      />
      <div className="relative z-10 space-y-6 text-center">
        <h1 className="text-6xl font-bold tracking-tighter text-primary">
          E-Commerce Platform
        </h1>
        <p className="mx-auto max-w-[600px] text-lg text-muted-foreground">
          A modern e-commerce platform built with Next.js 14, Supabase, and
          Tailwind CSS.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/auth/signin">Sign In</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/auth/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
