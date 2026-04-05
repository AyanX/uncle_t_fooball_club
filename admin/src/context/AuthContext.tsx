// context/AuthContext.tsx — extended with username, email in profile
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/services/api';

export interface AuthUser {
  email: string;
  token: string;
  username: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (partial: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null, loading: true,
  login: async () => {}, logout: async () => {}, updateUser: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser]   = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('admin_user');
    if (stored) { try { setUser(JSON.parse(stored)); } catch {} }
    setLoading(false);

    const onForbidden = async () => {
      await api.auth.logout().catch(() => {});
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      setUser(null);
    };
    window.addEventListener('admin:forbidden', onForbidden as any);
    return () => window.removeEventListener('admin:forbidden', onForbidden as any);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.auth.login(email, password);
    const d = res.data.data;
    const u: AuthUser = { email: d.email, token: d.token, username: d.username || 'admin' };
    localStorage.setItem('admin_token', u.token);
    localStorage.setItem('admin_user', JSON.stringify(u));
    setUser(u);
  };

  const logout = async () => {
    await api.auth.logout().catch(() => {});
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setUser(null);
  };

  const updateUser = (partial: Partial<AuthUser>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...partial };
      localStorage.setItem('admin_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
