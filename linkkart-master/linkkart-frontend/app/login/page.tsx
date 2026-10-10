'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthInput } from '@/components/auth/AuthInput';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { AuthAlert } from '@/components/auth/AuthAlert';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await api.auth.login(email, password);
      await queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      
      const role = result.role.toLowerCase();
      if (result.onboardingCompleted) {
        router.push(`/dashboard/${role}`);
      } else {
        router.push(`/onboarding/${role}`);
      }
    } catch (err: any) {
      setError(err.message || 'Your email or password is incorrect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    // Google auth logic handled by backend/oauth redirect
    window.location.href = '/api/auth/google';
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your LinkKart account to continue."
    >
      <button 
        type="button"
        onClick={handleGoogleLogin}
        disabled={googleLoading}
        className="w-full flex items-center justify-center gap-3 h-[52px] bg-slate-800/80 border border-slate-700/50 rounded-[12px] text-[15px] font-bold text-white hover:bg-slate-700 hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:border-slate-600 transition-all disabled:opacity-70 backdrop-blur-sm"
      >
        {googleLoading ? (
          <div className="w-5 h-5 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin" />
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        )}
        {googleLoading ? 'Connecting to Google...' : 'Continue with Google'}
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
        
        <AuthInput
          label="Email address"
          type="email"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />

        <PasswordInput
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />

        <div className="flex items-center justify-between mb-2 mt-2">
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="peer appearance-none w-[18px] h-[18px] rounded-[4px] border border-slate-600 bg-slate-800/50 checked:bg-blue-500 checked:border-blue-500 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500/30 focus:ring-offset-slate-900"
              />
              <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100" viewBox="0 0 14 14" fill="none">
                <path d="M3 8L6 11L11 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-[14px] text-slate-400 font-medium group-hover:text-slate-200 transition-colors">Remember me</span>
          </label>
          <Link href="/forgot-password" className="text-[14px] font-bold text-blue-400 hover:text-blue-300 transition-all hover:underline">
            Forgot password?
          </Link>
        </div>

        <AuthButton loading={loading} loadingText="Signing in...">
          Sign in
        </AuthButton>
      </form>

      <div className="mt-8 text-center text-[15px] font-medium text-slate-400">
        Don't have an account?{' '}
        <Link href="/register" className="text-blue-400 font-bold hover:text-blue-300 transition-all hover:underline">
          Create one
        </Link>
      </div>
    </AuthLayout>
  );
}
