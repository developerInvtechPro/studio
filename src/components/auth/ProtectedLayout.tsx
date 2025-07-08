
'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from '@/context/SessionContext';
import Spinner from '@/components/ui/spinner';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { user, loading } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) {
      return; 
    }

    if (!user && pathname !== '/login') {
      router.replace('/login');
    }
    
  }, [user, loading, router, pathname]);

  if (loading || !user) {
      return (
          <div className="h-screen w-screen flex items-center justify-center">
            <Spinner size="lg" />
          </div>
      );
  }

  return <>{children}</>;
}
