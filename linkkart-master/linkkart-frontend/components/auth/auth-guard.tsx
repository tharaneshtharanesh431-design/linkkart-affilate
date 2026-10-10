'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@/lib/hooks/useUser';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: response, isLoading, isError } = useUser();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (isError || !response || !response.data) {
      router.replace('/login');
      return;
    }

    const user = response.data.user;
    const role = user.role.toLowerCase();
    const onboarded = user.onboardingCompleted;

    // Determine current section
    const isDashboard = pathname.startsWith('/dashboard');
    const isOnboarding = pathname.startsWith('/onboarding');
    
    // Check role mismatch in paths
    if (isDashboard || isOnboarding) {
      const pathRole = pathname.split('/')[2]; // e.g. /dashboard/merchant -> merchant
      if (pathRole && pathRole !== role) {
        if (onboarded) {
          router.replace(`/dashboard/${role}`);
        } else {
          router.replace(`/onboarding/${role}`);
        }
        return;
      }
    }

    // Onboarding routing logic
    if (isDashboard && !onboarded) {
      router.replace(`/onboarding/${role}`);
      return;
    }

    if (isOnboarding && onboarded) {
      router.replace(`/dashboard/${role}`);
      return;
    }

    setIsAuthorized(true);
  }, [isLoading, isError, response, router, pathname]);

  if (!isAuthorized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
