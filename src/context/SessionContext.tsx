
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import type { User, Shift } from '@/lib/types';
import Spinner from '@/components/ui/spinner';

interface SessionContextType {
  user: User | null;
  shift: Shift;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  startShift: (startingCash: number) => void;
  endShift: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

const initialShiftState: Shift = {
  isActive: false,
  startingCash: 0,
  startTime: null,
};

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [shift, setShift] = useState<Shift>(initialShiftState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // User is logged in, check for active shift in localStorage
        const savedShift = localStorage.getItem('pos-shift');
        if (savedShift) {
          const parsedShift: Shift = JSON.parse(savedShift);
          if (parsedShift.isActive) {
            setShift(parsedShift);
          }
        }
      } else {
        // User logged out, clear shift
        setShift(initialShiftState);
        localStorage.removeItem('pos-shift');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const startShift = (startingCash: number) => {
    const newShift: Shift = {
      isActive: true,
      startingCash,
      startTime: new Date().toISOString(),
    };
    setShift(newShift);
    localStorage.setItem('pos-shift', JSON.stringify(newShift));
  };

  const endShift = () => {
    setShift(initialShiftState);
    localStorage.removeItem('pos-shift');
  };

  const value = { user, shift, loading, login, logout, startShift, endShift };

  return (
    <SessionContext.Provider value={value}>
      {loading ? <div className="h-screen w-screen flex items-center justify-center"><Spinner size="lg" /></div> : children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
