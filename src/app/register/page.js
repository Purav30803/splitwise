export const metadata = {
  title: 'Sign up - Splitwise Clone',
};

import Image from 'next/image';
import Link from 'next/link';
import RegisterForm from '@/components/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Brand / Illustration panel */}
      <div className="hidden md:flex flex-col justify-between bg-[#5BC5A7] text-white p-10">
        <div className="flex items-center gap-3">
          <Image src="/logo1.png" alt="Splitwise" width={40} height={40} />
          <span className="text-2xl font-semibold">Splitwise</span>
        </div>
        <div className="max-w-md">
          <h1 className="text-4xl font-semibold leading-tight">Make group expenses simple and fair</h1>
          <p className="mt-4 text-white/90">Create an account to start tracking and splitting with ease.</p>
        </div>
        <div className="text-sm text-white/90">© {new Date().getFullYear()} Splitwise Clone</div>
      </div>

      {/* Form panel */}
      <div className="flex flex-col justify-center p-6 md:p-12">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 flex items-center md:hidden gap-3">
            <Image src="/logo1.png" alt="Splitwise" width={36} height={36} />
            <span className="text-xl font-semibold">Splitwise</span>
          </div>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
} 