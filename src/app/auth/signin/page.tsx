import { Metadata } from 'next';
import Link from 'next/link';
import { SignInForm } from '@/components/auth/SignInForm';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your account',
};

export default function SignInPage() {
  return (
    <div className="container relative flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <SignInForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/auth/signup"
            className="hover:text-brand underline underline-offset-4"
          >
            Don&apos;t have an account? Sign Up
          </Link>
        </p>
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/auth/reset-password"
            className="hover:text-brand underline underline-offset-4"
          >
            Forgot your password?
          </Link>
        </p>
      </div>
    </div>
  );
}