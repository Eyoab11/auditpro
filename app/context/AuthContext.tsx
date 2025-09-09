"use client";
import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import apiFetch from '../../utils/api';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    if (!token) return;
    try {
      const res = await apiFetch('/api/auth/me');
      if (res?.data) setUser({ id: res.data._id, name: res.data.name, email: res.data.email });
    } catch {
      logout();
    }
  }, [token]);

  // Load token on mount & fetch user
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (stored && !token) {
      setToken(stored);
    } else if (!stored) {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token && !user) {
      refreshUser().finally(() => setLoading(false));
    }
  }, [token, user, refreshUser]);

  async function login(email: string, password: string) {
    setLoading(true);
    try {
      const res = await apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      if (res?.token) {
        localStorage.setItem('authToken', res.token);
        setToken(res.token);
        setUser(res.data);
      }
    } finally {
      setLoading(false);
    }
  }

  async function register(name: string, email: string, password: string) {
    setLoading(true);
    try {
      const res = await apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });
      if (res?.token) {
        localStorage.setItem('authToken', res.token);
        setToken(res.token);
        setUser(res.data);
      }
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  }

  // refreshUser provided by useCallback above

  return (
    <AuthContext.Provider value={{ user, loading, token, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
