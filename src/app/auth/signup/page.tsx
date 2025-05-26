import { Metadata } from 'next';
import Link from 'next/link';
import { SignUpForm } from '@/components/auth/SignUpForm';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create a new account',
};

export default function SignUpPage() {
  return (
    <div className="container relative flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <SignUpForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/auth/signin"
            className="hover:text-brand underline underline-offset-4"
          >
            Already have an account? Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}