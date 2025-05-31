'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';

export function ResetPasswordForm() {
  const router = useRouter();
  
  useEffect(() => {
    // Set a timeout to redirect automatically after a short delay
    const timeout = setTimeout(() => {
      router.push('/auth/signin');
    }, 5000);
    
    return () => clearTimeout(timeout);
  }, [router]);
  
  const handleRedirect = () => {
    router.push('/auth/signin');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-6 rounded-lg border bg-card p-6 shadow-lg"
    >
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Password Reset Not Available
        </h1>
        <div className="py-4">
          <Phone className="mx-auto h-12 w-12 text-primary" />
        </div>
        <p className="text-muted-foreground">
          Password reset is no longer available as we've switched to phone number authentication.
          Please use your phone number to sign in with a one-time code or use a social login provider.
        </p>
        <p className="text-sm text-muted-foreground">
          You will be redirected to the sign-in page in a few seconds...
        </p>
        <Button 
          className="w-full mt-4" 
          onClick={handleRedirect}
        >
          Go to Sign In
        </Button>
      </div>
    </motion.div>
  );
}