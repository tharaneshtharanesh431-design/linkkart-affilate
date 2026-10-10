import { ButtonHTMLAttributes, ReactNode } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  children: ReactNode;
  icon?: ReactNode;
}

export function AuthButton({ 
  loading = false, 
  loadingText = "Please wait...", 
  children, 
  icon = <ArrowRight size={18} />,
  className = "",
  disabled,
  ...props 
}: AuthButtonProps) {
  return (
    <button
      disabled={loading || disabled}
      className={`
        group relative w-full flex items-center justify-center gap-2 h-[52px] px-4 mt-4
        bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 active:from-blue-700 active:to-cyan-600
        text-white text-[15px] font-bold rounded-[12px]
        transition-all duration-300 ease-out overflow-hidden
        hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:-translate-y-[1px]
        disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0 disabled:before:hidden
        ${className}
      `}
      {...props}
    >
      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out pointer-events-none" />
      <span className="relative flex items-center justify-center gap-2 z-10">
        {loading ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            <span>{loadingText}</span>
          </>
        ) : (
          <>
            <span>{children}</span>
            <span className="transition-transform group-hover:translate-x-1">{icon}</span>
          </>
        )}
      </span>
    </button>
  );
}
