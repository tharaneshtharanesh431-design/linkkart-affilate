'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, User, Chrome } from 'lucide-react';
import { api } from '@/lib/api';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthInput } from '@/components/auth/AuthInput';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { AuthAlert } from '@/components/auth/AuthAlert';
import { RoleSelector } from '@/components/auth/RoleSelector';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get('role') === 'merchant' ? 'merchant' : 'affiliate';
  
  const [selectedPlan, setSelectedPlan] = useState(defaultRole);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const payload = {
      email: form.email,
      password: form.password,
      role: selectedPlan.toUpperCase(),
    };

    try {
      await api.auth.register(payload);
      setSuccess('Account created successfully. Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Email already exists or invalid data.');
    } finally {
      if (!success) setLoading(false);
    }
  };

  const passwordStrength =
    form.password.length === 0 ? 0 :
    form.password.length < 6 ? 1 :
    form.password.length < 10 ? 2 :
    form.password.length < 14 ? 3 : 4;

  const strengthColor = ['bg-slate-700/50', 'bg-red-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'][passwordStrength];

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Choose how you want to grow with LinkKart."
    >
      <RoleSelector selectedRole={selectedPlan} onSelect={setSelectedPlan} />

      <button 
        type="button"
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 h-[52px] bg-slate-800/80 border border-slate-700/50 rounded-[12px] text-[15px] font-bold text-white hover:bg-slate-700 hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:border-slate-600 transition-all disabled:opacity-70 mt-2 backdrop-blur-sm"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </button>

      <div className="relative mb-6 mt-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-700/50" />
        </div>
        <div className="relative flex justify-center text-[13px]">
          <span className="bg-slate-900 px-4 text-slate-400 font-medium">or continue with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col">
        {error && <div className="mb-4"><AuthAlert message={error} type="error" /></div>}
        {success && <div className="mb-4"><AuthAlert message={success} type="success" /></div>}

        <AuthInput
          label="Full name"
          type="text"
          icon={User}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="John Doe"
          required
        />

        <AuthInput
          label="Email address"
          type="email"
          icon={Mail}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="you@example.com"
          required
        />

        <div className="mb-2">
          <PasswordInput
            label="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Create a strong password"
            required
            minLength={8}
          />
          {form.password.length > 0 && (
              <div className="flex gap-1 mb-4 mt-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i <= passwordStrength ? strengthColor : 'bg-slate-700/50'}`}
                />
              ))}
            </div>
          )}
        </div>

        <AuthButton loading={loading} loadingText="Creating account..." disabled={!!success}>
          Create account
        </AuthButton>
      </form>

      <div className="mt-8 text-center text-[15px] font-medium text-slate-400">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-400 font-bold hover:text-blue-300 transition-all hover:underline">
          Sign in
        </Link>
      </div>
    </AuthLayout>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-8 h-8 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
