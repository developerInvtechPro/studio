
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/context/SessionContext';
import Spinner from '@/components/ui/spinner';

interface ProtectedLayoutProps {
  children: React.ReactNode;
  requireAuthOnly?: boolean; // If true, only checks for auth, not for active shift
}

export default function ProtectedLayout({ children, requireAuthOnly = false }: ProtectedLayoutProps) {
  const { user, shift, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return; // Wait until session state is loaded
    }

    if (!user) {
      router.replace('/login');
      return;
    }
    
    if (requireAuthOnly) {
      // If we only require authentication (e.g., for start-shift page)
      // and user is authenticated, we can stay. But if a shift is already active,
      // redirect to POS page.
      if (shift.isActive) {
        router.replace('/');
      }
      return;
    }

    // For the main POS page
    if (user && !shift.isActive) {
      router.replace('/start-shift');
    }

  }, [user, shift.isActive, loading, router, requireAuthOnly]);

  if (loading || !user || (!requireAuthOnly && !shift.isActive)) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}
