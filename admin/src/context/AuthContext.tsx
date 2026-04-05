// context/AuthContext.tsx — Session verified via GET /auth on mount (no localStorage)
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/services/api';

export interface AuthUser { email: string; token: string; username: string; }

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithPin: (email: string, pin: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (partial: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null, loading: true,
  login: async () => {}, loginWithPin: async () => {},
  logout: async () => {}, updateUser: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser]       = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verify session by hitting GET /auth — server validates cookie/token
    // If 200+: user is logged in. If <200 or error: not logged in.
    api.auth.verify()
      .then(u => { if (u) setUser(u); })
      .catch(() => { /* not authenticated */ })
      .finally(() => setLoading(false));

    // 403 on any request → force logout
    const onForbidden = async () => {
      await api.auth.logout().catch(() => {});
      setUser(null);
    };
    window.addEventListener('admin:forbidden', onForbidden as any);
    return () => window.removeEventListener('admin:forbidden', onForbidden as any);
  }, []);

  const _applyUser = (d: any, fallbackEmail?: string) => {
    const u: AuthUser = {
      email:    d.email    || fallbackEmail || '',
      token:    d.token    || '',
      username: d.username || 'admin',
    };
    // Only store token (not user data) — session is cookie-based
    if (u.token) localStorage.setItem('admin_token', u.token);
    setUser(u);
    return u;
  };

  const login = async (email: string, password: string) => {
    const res = await api.auth.login(email, password);
    _applyUser(res.data?.data ?? res.data, email);
  };

  const loginWithPin = async (email: string, pin: string) => {
    const res = await api.auth.loginWithPin(email, pin);
    _applyUser(res.data?.data ?? res.data, email);
  };

  const logout = async () => {
    await api.auth.logout().catch(() => {});
    localStorage.removeItem('admin_token');
    setUser(null);
  };

  const updateUser = (partial: Partial<AuthUser>) => {
    setUser(prev => prev ? { ...prev, ...partial } : prev);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithPin, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
