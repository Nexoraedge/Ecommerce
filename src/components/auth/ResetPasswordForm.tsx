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

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    // Check if we're in update mode (after clicking reset link)
    const code = searchParams.get('code');
    if (code) {
      setIsUpdateMode(true);
    }
  }, [searchParams]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(event.currentTarget);

    try {
      if (isUpdateMode) {
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }

        const { error } = await supabase.auth.updateUser({
          password: password,
        });

        if (error) throw error;

        setSuccess(true);
        setTimeout(() => {
          router.push('/auth/signin');
        }, 2000);
      } else {
        const email = formData.get('email') as string;
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        });

        if (error) throw error;
        setSuccess(true);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
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
          {isUpdateMode ? 'Update Password' : 'Reset Password'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isUpdateMode
            ? 'Enter your new password'
            : 'Enter your email to reset your password'}
        </p>
      </div>
      <form onSubmit={onSubmit}>
        <div className="space-y-4">
          {!isUpdateMode ? (
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
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  autoComplete="new-password"
                  disabled={isLoading}
                  required
                />
              </div>
            </>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert>
              <AlertDescription>
                {isUpdateMode
                  ? 'Password updated successfully. Redirecting to sign in...'
                  : 'Check your email for a password reset link.'}
              </AlertDescription>
            </Alert>
          )}
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isUpdateMode ? 'Update Password' : 'Send Reset Link'}
          </Button>
        </div>
      </form>
      {!isUpdateMode && (
        <Button
          variant="link"
          className="w-full"
          onClick={() => router.push('/auth/signin')}
        >
          Back to Sign In
        </Button>
      )}
    </motion.div>
  );
}