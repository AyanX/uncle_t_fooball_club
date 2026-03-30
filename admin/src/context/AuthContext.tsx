// context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';

interface AuthUser { email: string; token: string; }
interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null, loading: true,
  login: async () => {}, logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser]   = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('admin_user');
    if (stored) { try { setUser(JSON.parse(stored)); } catch {} }
    setLoading(false);

    // 403 event from axios interceptor → force logout
    const onForbidden = () => {
      doLogout();
    };
    window.addEventListener('admin:forbidden', onForbidden);
    return () => window.removeEventListener('admin:forbidden', onForbidden);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.auth.login(email, password);
    const u: AuthUser = { email: res.data.data.email, token: res.data.data.token };
    localStorage.setItem('admin_token', u.token);
    localStorage.setItem('admin_user', JSON.stringify(u));
    setUser(u);
  };

  const doLogout = async () => {
    await api.auth.logout().catch(() => {});
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setUser(null);
  };

  const logout = doLogout;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
