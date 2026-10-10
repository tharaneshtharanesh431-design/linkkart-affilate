import Link from 'next/link';
import { ReactNode } from 'react';
import { Sparkles } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: ReactNode;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 w-full relative bg-slate-950 overflow-hidden">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] mix-blend-screen animate-pulse duration-10000" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] mix-blend-screen animate-pulse duration-10000 delay-1000" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-cyan-500/10 blur-[100px] mix-blend-screen animate-pulse duration-10000 delay-500" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Logo */}
      <div className="mb-10 relative z-10 flex items-center justify-center">
        <Link href="/" className="group flex items-center gap-3 transition-all duration-300 hover:scale-105">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 p-[1px] shadow-[0_0_20px_rgba(59,130,246,0.3)] group-hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all">
            <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center group-hover:bg-transparent transition-colors duration-300">
               <span className="font-bold text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-cyan-300 group-hover:text-white transition-colors text-xl">LK</span>
            </div>
          </div>
          <span className="text-3xl font-extrabold text-white tracking-tight">LinkKart</span>
        </Link>
      </div>

      {/* Auth Card (Glassmorphism) */}
      <div className="w-full max-w-[480px] bg-slate-900/60 backdrop-blur-xl rounded-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-slate-700/50 p-8 sm:p-12 relative z-10 overflow-hidden group/card transition-all duration-500 hover:border-slate-600/50 hover:shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
        
        {/* Card Highlight */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="text-center mb-10 relative">
          <div className="inline-flex items-center justify-center p-2 bg-blue-500/10 rounded-full mb-4 ring-1 ring-blue-500/20">
            <Sparkles className="w-5 h-5 text-blue-400" />
          </div>
          <h1 className="text-3xl leading-tight font-bold text-white mb-3 tracking-tight">{title}</h1>
          <p className="text-[16px] text-slate-400 font-medium">{subtitle}</p>
        </div>

        {children}

        {/* Optional Trust Message */}
        <div className="mt-10 text-center border-t border-slate-800 pt-8 relative">
          <p className="text-[13px] text-slate-500 flex items-center justify-center gap-2 font-medium">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            End-to-end encrypted & secure authentication
          </p>
        </div>
      </div>
    </div>
  );
}
