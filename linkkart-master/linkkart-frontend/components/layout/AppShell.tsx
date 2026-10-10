'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/lib/hooks/useUser';
import { api } from '@/lib/api';
import { 
  LayoutDashboard, 
  Package, 
  Megaphone, 
  Users, 
  Activity, 
  DollarSign,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Link2,
  Bot,
  ShieldAlert
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { NotificationDropdown } from './notification-dropdown';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: userResponse, isLoading } = useUser();
  const user = userResponse?.data?.user;
  const profile = userResponse?.data?.profile;
  const role = user?.role;

  const handleLogout = async () => {
    try {
      await api.auth.logout();
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const merchantLinks = [
    { name: 'Dashboard', href: '/dashboard/merchant', icon: LayoutDashboard },
    { name: 'Products', href: '/dashboard/merchant/products', icon: Package },
    { name: 'Campaigns', href: '/dashboard/merchant/campaigns', icon: Megaphone },
    { name: 'Affiliates', href: '/dashboard/merchant/affiliates', icon: Users },
    { name: 'Conversions', href: '/dashboard/merchant/conversions', icon: Activity },
    { name: 'Commissions', href: '/dashboard/merchant/commissions', icon: DollarSign },
    { name: 'AI Tools', href: '/dashboard/merchant/ai', icon: Bot },
  ];

  const affiliateLinks = [
    { name: 'Dashboard', href: '/dashboard/affiliate', icon: LayoutDashboard },
    { name: 'Marketplace', href: '/marketplace', icon: Package },
    { name: 'My Links', href: '/dashboard/affiliate/links', icon: Link2 },
    { name: 'Earnings & Payouts', href: '/dashboard/affiliate/earnings', icon: DollarSign },
    { name: 'AI Tools', href: '/dashboard/affiliate/ai', icon: Bot },
  ];

  const adminLinks = [
    { name: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/dashboard/admin/users', icon: Users },
    { name: 'Merchants', href: '/dashboard/admin/merchants', icon: Users },
    { name: 'Affiliates', href: '/dashboard/admin/affiliates', icon: Users },
    { name: 'Applications', href: '/dashboard/admin/applications', icon: Activity },
    { name: 'Products', href: '/dashboard/admin/products', icon: Package },
    { name: 'Campaigns', href: '/dashboard/admin/campaigns', icon: Megaphone },
    { name: 'Conversions', href: '/dashboard/admin/conversions', icon: Activity },
    { name: 'Commissions', href: '/dashboard/admin/commissions', icon: DollarSign },
    { name: 'Payouts', href: '/dashboard/admin/payouts', icon: DollarSign },
    { name: 'Audit Logs', href: '/dashboard/admin/audit-logs', icon: Activity },
    { name: 'Fraud & Risk', href: '/dashboard/admin/fraud', icon: ShieldAlert },
  ];

  const getLinks = () => {
    if (role === 'MERCHANT') return merchantLinks;
    if (role === 'AFFILIATE') return affiliateLinks;
    if (role === 'ADMIN') return adminLinks;
    return [];
  };

  const navLinks = getLinks();
  
  const getInitials = (name: string) => name ? name.substring(0, 2).toUpperCase() : 'U';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 
        transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:h-screen md:sticky md:top-0
        flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-inner">
              L
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Link Kart</span>
          </Link>
          <button 
            className="ml-auto md:hidden text-slate-500 hover:text-slate-900 dark:hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors group
                  ${isActive 
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'}
                `}
              >
                <Icon size={18} className={`mr-3 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300'}`} />
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2.5 rounded-md text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-700 dark:text-slate-400 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors"
          >
            <LogOut size={18} className="mr-3 text-slate-400" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Topbar */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 z-10 sticky top-0">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="mr-4 md:hidden text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:block">
              {/* Optional Breadcrumb or contextual title could go here */}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <NotificationDropdown />
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-medium text-slate-900 dark:text-white leading-none">
                  {profile?.businessName || profile?.firstName || user?.email?.split('@')[0] || 'User'}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 capitalize leading-none">
                  {role?.toLowerCase()}
                </span>
              </div>
              <Avatar className="h-9 w-9 border border-slate-200 dark:border-slate-700">
                <AvatarImage src="" />
                <AvatarFallback className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                  {getInitials(profile?.businessName || profile?.firstName || user?.email || 'U')}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 relative">
          {children}
        </main>

      </div>
    </div>
  );
}
