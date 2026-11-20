'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AuthService, type AdminUser } from '@/server/auth.service';
import { DashboardSkeleton } from '@/components/skeletons/DashboardSkeleton';

export interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ admin: AdminUser }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<AdminUser | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  // refresh profile on demand
  const refreshProfile = useCallback(async (): Promise<AdminUser | null> => {
    try {
      const profile = await AuthService.getProfile();
      setUser(profile);
      return profile;
    } catch {
      setUser(null);
      if (pathname !== '/login') {
        router.replace('/login');
      }
      return null;
    }
  }, [pathname, router]);

  // fetch current user once on initial mount
  useEffect(() => {
    let isMounted = true;

    AuthService.getProfile()
      .then((profile) => {
        if (isMounted) setUser(profile);
      })
      .catch(() => {
        if (isMounted) {
          setUser(null);
          // if unauthenticated and on a protected page, redirect cleanly to /login
          if (pathname !== '/login') {
            router.replace('/login');
          }
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [pathname, router]);

  // login
  const login = useCallback(
    async (email: string, password: string) => {
      const res = await AuthService.login(email, password);
      setUser(res.admin);
      setLoading(false);

      if (typeof window !== 'undefined') {
        const searchParams = new URLSearchParams(window.location.search);
        const from = searchParams.get('from');
        if (from && from.startsWith('/') && !from.startsWith('//')) {
          router.replace(from);
          return { admin: res.admin };
        }
      }

      router.replace('/dashboard');
      return { admin: res.admin };
    },
    [router]
  );

  // logout
  const logout = useCallback(async () => {
    setUser(null);
    setLoading(false);
    try {
      await AuthService.logout();
    } finally {
      router.replace('/login');
    }
  }, [router]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      logout,
      refreshProfile,
    }),
    [user, loading, login, logout, refreshProfile]
  );

  // prevent unauthorized dashboard or protected content flash while verifying or if not logged in
  if ((loading || !user) && pathname !== '/login') {
    return (
      <AuthContext.Provider value={value}>
        <DashboardSkeleton withLayout={true} pathname={pathname} animated={false} />
      </AuthContext.Provider>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// auth hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
