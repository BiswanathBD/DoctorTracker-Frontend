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

  // refresh admin profile from /auth/me using HTTP-only cookie
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

  // initial auth verification on every page reload/mount
  useEffect(() => {
    let isMounted = true;

    // if already verified and authenticated, skip re-verification on protected route changes
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

        // if authenticated and currently on login page, redirect to dashboard
        if (isPublicRoute) {
          router.replace('/dashboard');
        }
      } catch {
        if (isMounted) {
          setUser(null);
          setLoading(false);
          hasVerified.current = true;
        }

        // if unauthenticated and on protected route, clean redirect directly to login
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

  // login handler
  const login = useCallback(
    async (email: string, password: string) => {
      const res = await AuthService.login(email, password);
      setUser(res.admin);
      router.replace('/dashboard');
      return { admin: res.admin };
    },
    [router]
  );

  // logout handler
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

  // on protected routes, if unauthenticated or verifying, NEVER render protected page content
  if (!isPublicRoute && (!user || loading)) {
    return (
      <AuthContext.Provider value={value}>
        <DashboardSkeleton withLayout={true} pathname={pathname} animated={false} />
      </AuthContext.Provider>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// custom hook to access auth state anywhere in the application
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
