'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/ui/icons';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X, Phone } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface VerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  phone: string;
}

export function VerificationDialog({ isOpen, onClose, phone }: VerificationDialogProps) {
  const router = useRouter();
  const { signInWithPhone } = useAuth();
  const [isSending, setIsSending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResendOTP = async () => {
    try {
      setIsSending(true);
      setResendSuccess(false);
      setError(null);

      // Format phone number to E.164 format if not already formatted
      let formattedPhone = phone;
      if (!phone.startsWith('+')) {
        formattedPhone = `+${phone}`;
      }

      const { error } = await signInWithPhone(formattedPhone);

      if (error) {
        throw new Error(error);
      }

      setResendSuccess(true);
    } catch (err: any) {
      console.error('Failed to resend OTP:', err);
      setError(err.message || 'Failed to send verification code. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md rounded-lg border bg-card p-6 shadow-lg"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>

            <div className="space-y-4 text-center">
              <h2 className="text-xl font-semibold">Check your phone</h2>
              <p className="text-sm text-muted-foreground">
                We've sent a verification code to <span className="font-medium">{phone}</span>.
                Please enter the code to verify your account.
              </p>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Didn't receive the code? Click below to resend.
                </p>
                <Button
                  variant="outline"
                  onClick={handleResendOTP}
                  disabled={isSending}
                  className="w-full"
                >
                  {isSending ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Phone className="mr-2 h-4 w-4" />
                      Resend Verification Code
                    </>
                  )}
                </Button>
                {resendSuccess && (
                  <p className="text-sm text-green-500">
                    Verification code resent successfully!
                  </p>
                )}
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="pt-4">
                <Button
                  variant="link"
                  onClick={() => {
                    onClose();
                    router.push('/auth/signin');
                  }}
                  className="text-sm text-muted-foreground"
                >
                  Back to Sign In
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
