// context/AuthContext.tsx — Session via GET /auth + profile via GET /admin/profile
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
    // 1. Verify session via GET /auth
    // 2. Fetch real profile (username, email) via GET /admin/profile
    const init = async () => {
      try {
        const authData = await api.auth.verify();
        if (!authData) { setLoading(false); return; }

        // Session valid — fetch full profile for accurate username/email
        const profile = await api.auth.getProfile().catch(() => null);

        setUser({
          email:    profile?.email    || authData?.email    || '',
          token:    authData?.token   || localStorage.getItem('admin_token') || '',
          username: profile?.username || authData?.username || 'Admin',
        });
      } catch {
        /* not authenticated — stays null */
      } finally {
        setLoading(false);
      }
    };

    init();

    // 403 on any request → force logout
    const onForbidden = async () => {
      await api.auth.logout().catch(() => {});
      localStorage.removeItem('admin_token');
      setUser(null);
    };
    window.addEventListener('admin:forbidden', onForbidden as any);
    return () => window.removeEventListener('admin:forbidden', onForbidden as any);
  }, []);

  const _applyUser = async (d: any, fallbackEmail?: string) => {
    // After login, also fetch profile to get real username
    const profile = await api.auth.getProfile().catch(() => null);
    const u: AuthUser = {
      email:    profile?.email    || d.email    || fallbackEmail || '',
      token:    d.token    || '',
      username: profile?.username || d.username || 'Admin',
    };
    if (u.token) localStorage.setItem('admin_token', u.token);
    setUser(u);
    return u;
  };

  const login = async (email: string, password: string) => {
    const res = await api.auth.login(email, password);
    await _applyUser(res.data?.data ?? res.data, email);
  };

  const loginWithPin = async (email: string, pin: string) => {
    const res = await api.auth.loginWithPin(email, pin);
    await _applyUser(res.data?.data ?? res.data, email);
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
