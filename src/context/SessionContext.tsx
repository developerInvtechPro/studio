
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { User, Shift } from '@/lib/types';
import Spinner from '@/components/ui/spinner';
import { loginAction, getActiveShiftAction, startShiftAction, endShiftAction } from '@/app/actions';

interface SessionContextType {
  user: User | null;
  shift: Shift | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  startShift: (startingCash: number) => Promise<void>;
  endShift: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [shift, setShift] = useState<Shift | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true);
        const savedUser = localStorage.getItem('pos-user');
        if (savedUser) {
          const parsedUser: User = JSON.parse(savedUser);
          setUser(parsedUser);

          const activeShift = await getActiveShiftAction(parsedUser.id);
          if (activeShift) {
            setShift(activeShift);
          }
        }
      } catch (error) {
        console.error("Session check failed", error);
        localStorage.removeItem('pos-user');
        setUser(null);
        setShift(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (username: string, password: string): Promise<User> => {
    const result = await loginAction({ username, password });

    if (result.success && result.user) {
      const fullUser = result.user as User;
      setUser(fullUser);
      localStorage.setItem('pos-user', JSON.stringify(fullUser));
      const activeShift = await getActiveShiftAction(fullUser.id);
      if (activeShift) {
        setShift(activeShift);
      }
      return Promise.resolve(fullUser);
    } else {
      throw new Error(result.error || 'Credenciales inválidas');
    }
  };

  const logout = async () => {
    setUser(null);
    setShift(null);
    localStorage.removeItem('pos-user');
  };

  const startShift = async (startingCash: number) => {
    if (!user) throw new Error("User not logged in");
    const newShift = await startShiftAction(user.id, startingCash);
    setShift(newShift);
  };

  const endShift = async () => {
    if (!shift) return;
    await endShiftAction(shift.id);
    setShift(null);
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
