import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface AuthAlertProps {
  message: string;
  type?: 'error' | 'success';
}

export function AuthAlert({ message, type = 'error' }: AuthAlertProps) {
  if (!message) return null;

  const isError = type === 'error';

  return (
    <div 
      className={`
        flex items-start gap-3 p-3.5 mb-5 rounded-xl border text-sm animate-in fade-in slide-in-from-top-2 duration-200
        ${isError 
          ? 'bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400' 
          : 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400'
        }
      `}
    >
      <div className="mt-0.5 shrink-0">
        {isError ? (
          <AlertCircle size={16} className="text-red-500 dark:text-red-400" />
        ) : (
          <CheckCircle2 size={16} className="text-emerald-500 dark:text-emerald-400" />
        )}
      </div>
      <div className="font-medium leading-relaxed">
        {message}
      </div>
    </div>
  );
}
