'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react';
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

  const isPublicRoute = pathname === '/login';

  // refresh profile
  const refreshProfile = useCallback(async (): Promise<AdminUser | null> => {
    try {
      const profile = await AuthService.getProfile();
      setUser(profile);
      return profile;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  const hasVerified = useRef(false);

  // verify auth on mount
  useEffect(() => {
    let isMounted = true;

    if (hasVerified.current && user && !isPublicRoute) {
      setLoading(false);
      return;
    }

    const verifyAuth = async () => {
      try {
        const profile = await AuthService.getProfile();

        if (isMounted) {
          setUser(profile);
          setLoading(false);
          hasVerified.current = true;
        }

        if (isPublicRoute) {
          router.replace('/dashboard');
        }
      } catch {
        if (isMounted) {
          setUser(null);
          setLoading(false);
          hasVerified.current = true;
        }

        if (!isPublicRoute) {
          router.replace('/login');
        }
      }
    };

    verifyAuth();

    return () => {
      isMounted = false;
    };
  }, [isPublicRoute, router, user]);

  // login
  const login = useCallback(
    async (email: string, password: string) => {
      const res = await AuthService.login(email, password);
      setUser(res.admin);

      // check return destination
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
    hasVerified.current = false;
    setUser(null);
    await AuthService.logout();
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      login,
      logout,
      refreshProfile,
    }),
    [user, loading, login, logout, refreshProfile]
  );

  // prevent unauthorized children flash
  if (!isPublicRoute && (!user || loading)) {
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
