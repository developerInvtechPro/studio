
'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from '@/context/SessionContext';
import Spinner from '@/components/ui/spinner';

interface ProtectedLayoutProps {
  children: React.ReactNode;
  requireAuthOnly?: boolean; 
}

export default function ProtectedLayout({ children, requireAuthOnly = false }: ProtectedLayoutProps) {
  const { user, shift, loading } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) {
      return; 
    }

    // If no user, always redirect to login, except for the login page itself
    if (!user && pathname !== '/login') {
      router.replace('/login');
      return;
    }
    
    // If user is logged in
    if (user) {
        if (requireAuthOnly) {
            // This is for the start-shift page.
            // If a shift is already active, redirect to the main POS page.
            if (shift?.isActive) {
                router.replace('/');
            }
            // Otherwise, stay on the start-shift page.
            return;
        }

        // This is for all other protected pages (e.g., main POS page).
        // If there's no active shift, they must go to start-shift.
        if (!shift?.isActive) {
            router.replace('/start-shift');
        }
    }

  }, [user, shift, loading, router, requireAuthOnly, pathname]);

  // Determine what to show while loading or redirecting
  const showSpinner = loading || !user || (!requireAuthOnly && !shift?.isActive);
  
  if (showSpinner) {
      return (
          <div className="h-screen w-screen flex items-center justify-center">
            <Spinner size="lg" />
          </div>
      );
  }

  return <>{children}</>;
}
