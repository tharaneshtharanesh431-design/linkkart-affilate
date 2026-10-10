import { User, Store } from 'lucide-react';

interface RoleSelectorProps {
  selectedRole: string;
  onSelect: (role: string) => void;
}

export function RoleSelector({ selectedRole, onSelect }: RoleSelectorProps) {
  const roles = [
    { id: 'affiliate', label: 'Affiliate', icon: User },
    { id: 'merchant', label: 'Merchant', icon: Store },
  ];

  return (
    <div className="flex bg-slate-800/50 p-1.5 rounded-[16px] mb-6 border border-slate-700/50 backdrop-blur-sm shadow-inner">
      {roles.map((role) => {
        const isSelected = selectedRole === role.id;
        const Icon = role.icon;
        
        return (
          <button
            key={role.id}
            type="button"
            onClick={() => onSelect(role.id)}
            className={`
              flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-[12px] text-sm font-bold transition-all duration-300
              ${isSelected 
                ? 'bg-blue-600 text-white shadow-[0_4px_12px_rgba(37,99,235,0.3)] border border-blue-500/50' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 border border-transparent'
              }
            `}
          >
            <Icon size={18} className={isSelected ? 'text-blue-200' : 'text-slate-500'} strokeWidth={isSelected ? 2.5 : 2} />
            {role.label}
          </button>
        );
      })}
    </div>
  );
}
