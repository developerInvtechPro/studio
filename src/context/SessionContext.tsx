
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, Shift } from '@/lib/types';
import Spinner from '@/components/ui/spinner';

interface SessionContextType {
  user: User | null;
  shift: Shift;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
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
    try {
      const savedUser = localStorage.getItem('pos-user');
      if (savedUser) {
        const parsedUser: User = JSON.parse(savedUser);
        setUser(parsedUser);

        // User is logged in, check for active shift in localStorage
        const savedShift = localStorage.getItem('pos-shift');
        if (savedShift) {
          const parsedShift: Shift = JSON.parse(savedShift);
          if (parsedShift.isActive) {
            setShift(parsedShift);
          }
        }
      }
    } catch (error) {
      // If parsing fails, reset state
      setUser(null);
      setShift(initialShiftState);
      localStorage.removeItem('pos-user');
      localStorage.removeItem('pos-shift');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    // NOTE: In a real app, you would validate against a database.
    // For this demo, we'll use a hardcoded user.
    if (username === 'admin' && password === 'password') {
      const loggedInUser: User = { id: '1', username: 'admin' };
      setUser(loggedInUser);
      localStorage.setItem('pos-user', JSON.stringify(loggedInUser));
      return Promise.resolve();
    } else {
      throw new Error('Credenciales inválidas');
    }
  };

  const logout = async () => {
    setUser(null);
    setShift(initialShiftState);
    localStorage.removeItem('pos-user');
    localStorage.removeItem('pos-shift');
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
