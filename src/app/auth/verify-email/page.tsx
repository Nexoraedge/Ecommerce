import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export const metadata: Metadata = {
  title: 'Verify Email',
  description: 'Verify your email address',
};

export default function VerifyEmailPage() {
  return (
    <div className="container relative flex min-h-screen flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]"
      >
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Check your email
          </h1>
          <p className="text-sm text-muted-foreground">
            We&apos;ve sent you a verification link. Please check your email and
            click the link to verify your account.
          </p>
        </div>
        <Button asChild variant="link">
          <Link href="/auth/signin">Back to Sign In</Link>
        </Button>
      </motion.div>
    </div>
  );
}