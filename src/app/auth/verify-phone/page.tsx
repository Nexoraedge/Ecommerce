import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Verify Phone',
  description: 'Verify your phone number',
};

export default function VerifyPhonePage() {
  return (
    <div className="container relative flex min-h-screen flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]"
      >
        <div className="flex flex-col space-y-4 text-center">
          <Phone className="mx-auto h-12 w-12 text-primary" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Check your phone
          </h1>
          <p className="text-sm text-muted-foreground">
            We&apos;ve sent you a verification code via SMS. Please enter the code
            to verify your phone number and complete the sign-up process.
          </p>
        </div>
        <Button asChild variant="link">
          <Link href="/auth/signin">Back to Sign In</Link>
        </Button>
      </motion.div>
    </div>
  );
}