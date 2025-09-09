"use client";
import { useAuth } from '../context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const PUBLIC_ROUTES = new Set(['/auth/login', '/auth/signup', '/']);

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user && !PUBLIC_ROUTES.has(pathname)) {
        router.replace('/auth/login');
      }
      if (user && PUBLIC_ROUTES.has(pathname) && pathname !== '/dashboard') {
        router.replace('/dashboard');
      }
    }
  }, [user, loading, pathname, router]);

  if (!user && !PUBLIC_ROUTES.has(pathname)) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  return <>{children}</>;
}
