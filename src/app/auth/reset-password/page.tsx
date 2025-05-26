import { Metadata } from 'next';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Reset your password',
};

export default function ResetPasswordPage() {
  return (
    <div className="container relative flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <ResetPasswordForm />
      </div>
    </div>
  );
}