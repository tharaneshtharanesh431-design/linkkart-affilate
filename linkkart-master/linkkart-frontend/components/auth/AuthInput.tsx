import { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

export interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, icon: Icon, error, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1.5 mb-4">
        <label className="block text-[13px] font-semibold text-slate-300">
          {label}
        </label>
        <div className="relative group">
          {Icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors pointer-events-none z-10">
              <Icon size={18} strokeWidth={2} />
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full h-[52px] rounded-[12px] border bg-slate-800/50 text-[15px] text-white 
              placeholder:text-slate-500 
              focus:outline-none focus:ring-0
              transition-all duration-300 shadow-inner backdrop-blur-sm
              ${Icon ? 'pl-11 pr-4' : 'px-4'}
              ${error 
                ? 'border-red-500/50 focus:border-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.1)] bg-red-500/5' 
                : 'border-slate-700/50 focus:border-blue-500/50 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.2)] focus:bg-slate-800 hover:border-slate-600 hover:bg-slate-800/80'
              }
              ${className}
            `}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
      </div>
    );
  }
);
AuthInput.displayName = 'AuthInput';
