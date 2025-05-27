'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/ui/icons';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { createBrowserClient } from '@supabase/ssr';

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Clear error when URL changes
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(
        errorParam === 'auth' ? 'Authentication failed'
        : errorParam === 'session' ? 'Session expired'
        : 'An error occurred'
      );
    }
  }, [searchParams]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;

    try {
      if (isResetMode) {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
        });

        if (resetError) throw resetError;
        setResetSent(true);
      } else {
        const password = formData.get('password') as string;
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        const next = searchParams.get('next') || '/dashboard';
        router.push(next);
        router.refresh();
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
      if (!data) throw new Error('No data returned from Google sign in');
    } catch (error: any) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  if (resetSent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full space-y-6 rounded-lg border bg-card p-6 shadow-lg"
      >
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-semibold">Check your email</h2>
          <p className="text-sm text-muted-foreground">
            We've sent you a password reset link. Please check your email.
          </p>
        </div>
        <Button
          className="w-full"
          variant="outline"
          onClick={() => {
            setIsResetMode(false);
            setResetSent(false);
          }}
        >
          Back to Sign In
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-6 rounded-lg border bg-card p-6 shadow-lg backdrop-blur-lg"
    >
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {isResetMode ? 'Reset Password' : 'Welcome back'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isResetMode 
            ? 'Enter your email to receive a reset link'
            : 'Enter your email to sign in to your account'
          }
        </p>
      </div>
      <form onSubmit={onSubmit}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="m@example.com"
              type="email"
              name="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              required
            />
          </div>
          {!isResetMode && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                autoComplete="current-password"
                disabled={isLoading}
                required
              />
            </div>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isResetMode ? 'Send Reset Link' : 'Sign In'}
          </Button>
        </div>
      </form>
      <div className="flex justify-center">
        <Button
          variant="link"
          className="text-xs text-muted-foreground"
          onClick={() => {
            setIsResetMode(!isResetMode);
            setError(null);
          }}
        >
          {isResetMode ? 'Back to Sign In' : 'Forgot your password?'}
        </Button>
      </div>
      {!isResetMode && (
        <>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            type="button"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.google className="mr-2 h-4 w-4" />
            )}
            Google
          </Button>
        </>
      )}
    </motion.div>
  );
}