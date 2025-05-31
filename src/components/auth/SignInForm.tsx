'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/ui/icons';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Phone } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Provider } from '@supabase/supabase-js';

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signInWithPhone, signInWithSocialProvider, verifyOtp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  // Clear error when URL changes
  useEffect(() => {
    const errorParam = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    
    if (errorParam) {
      console.log('Auth error detected:', errorParam, errorDescription);
      
      // For PKCE errors, provide a helpful message and clear state
      if (errorParam === 'auth_code_challenge' || 
          errorParam.includes('code challenge') || 
          errorParam === 'bad_oauth_state' ||
          errorParam === 'invalid_request') {
        
        setError('Authentication error. Please try again in a private/incognito window or after clearing your browser cookies.');
        
        // Clear all auth state
        if (typeof window !== 'undefined') {
          // Clear local storage
          localStorage.clear();
          sessionStorage.clear();
          
          // Clear cookies
          document.cookie.split(';').forEach(cookie => {
            const [name] = cookie.trim().split('=');
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          });
        }
      } else {
        // Handle other error types
        setError(
          errorParam === 'auth' ? 'Authentication failed' :
          errorParam === 'session' ? 'Session expired' :
          errorParam === 'exchange_error' ? 'Authentication error. Please try again.' :
          errorParam === 'missing_code' ? 'Authentication process was interrupted. Please try again.' :
          errorDescription || 'An error occurred during authentication'
        );
      }
    }
  }, [searchParams]);

  // Handle phone number submission
  async function handlePhoneSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Format phone number to E.164 format if not already formatted
      let formattedPhone = phone;
      if (!phone.startsWith('+')) {
        formattedPhone = `+${phone}`;
      }

      const { error, message } = await signInWithPhone(formattedPhone);

      if (error) {
        throw new Error(error);
      }

      setOtpSent(true);
      setPhone(formattedPhone); // Store the formatted phone number
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  // Handle OTP verification
  async function handleOtpSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await verifyOtp(phone, otp);

      if (error) {
        throw new Error(error);
      }

      if (data?.user && data?.session) {
        const next = searchParams.get('next') || '/';
        router.push(next);
        router.refresh();
      } else {
        throw new Error('Failed to verify OTP. Please try again.');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  // Handle social provider sign in
  async function handleSocialSignIn(provider: Provider) {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await signInWithSocialProvider(provider);

      if (error) {
        throw new Error(error);
      }

      // The user will be redirected to the provider's login page
    } catch (error: any) {
      setError(error.message);
      setIsLoading(false);
    }
  }

  // If OTP has been sent, show the OTP verification form
  if (otpSent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full space-y-6 rounded-lg border border-border bg-card p-6 shadow-lg"
      >
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-semibold">Verify your phone</h2>
          <p className="text-sm text-muted-foreground">
            We've sent a verification code to {phone}.
            Please enter it below.
          </p>
        </div>
        <form onSubmit={handleOtpSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                placeholder="123456"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                autoCapitalize="none"
                autoComplete="one-time-code"
                autoCorrect="off"
                disabled={isLoading}
                required
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button
              className="w-full"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Verify Code
            </Button>
            <Button
              className="w-full"
              variant="outline"
              type="button"
              onClick={() => {
                setOtpSent(false);
                setOtp('');
              }}
              disabled={isLoading}
            >
              Back to Sign In
            </Button>
          </div>
        </form>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-6 rounded-lg border border-border bg-card p-6 shadow-lg"
    >
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold">Sign In</h2>
        <p className="text-sm text-muted-foreground">
          Enter your phone number or use a social provider to sign in
        </p>
      </div>
      <Tabs defaultValue="phone" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="phone">
            <Phone className="mr-2 h-4 w-4" />
            Phone
          </TabsTrigger>
          <TabsTrigger value="social">
            <Icons.google className="mr-2 h-4 w-4" />
            Social
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="phone" className="space-y-4">
          <form onSubmit={handlePhoneSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+1234567890"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoCapitalize="none"
                  autoComplete="tel"
                  autoCorrect="off"
                  disabled={isLoading}
                  required
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button
                className="w-full"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Send Verification Code
              </Button>
            </div>
          </form>
        </TabsContent>
        
        <TabsContent value="social" className="space-y-4">
          <div className="grid gap-2">
            <Button
              className="w-full"
              variant="outline"
              type="button"
              onClick={() => handleSocialSignIn('google')}
              disabled={isLoading}
            >
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.google className="mr-2 h-4 w-4" />
              )}
              Continue with Google
            </Button>
            <Button
              className="w-full"
              variant="outline"
              type="button"
              onClick={() => handleSocialSignIn('apple')}
              disabled={isLoading}
            >
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.apple className="mr-2 h-4 w-4" />
              )}
              Continue with Apple
            </Button>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}