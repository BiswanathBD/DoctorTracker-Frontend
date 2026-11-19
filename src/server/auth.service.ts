import { apiClient } from './api.client';
import type { AdminUser, LoginResponse } from '@/types/auth.types';

export type { AdminUser, LoginResponse };

// in-memory reactive auth state
let currentUser: AdminUser | null = null;
let listeners: Array<() => void> = [];
let pendingProfilePromise: Promise<AdminUser> | null = null;

const notifyAuthListeners = () => {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error('auth listener error:', e);
    }
  });
};

export const subscribeAuth = (callback: () => void) => {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
};

export const getAuthSnapshot = (): AdminUser | null => currentUser;
export const getAuthServerSnapshot = (): AdminUser | null => null;

interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

// clean, production-ready auth service with HTTP-only cookies
export const AuthService = {
  // admin login: server sets HTTP-only cookie automatically
  async login(email: string, password: string): Promise<LoginResponse> {
    const res = await apiClient<ApiResponse<LoginResponse>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const { admin, token } = res.data;
    currentUser = admin;
    notifyAuthListeners();

    return { admin, token };
  },

  // admin logout: server clears HTTP-only cookie and frontend resets memory state
  async logout(): Promise<void> {
    try {
      await apiClient<ApiResponse<null>>('/auth/logout', {
        method: 'POST',
      });
    } catch (err) {
      console.warn('Logout API notification error:', err);
    } finally {
      currentUser = null;
      notifyAuthListeners();

      if (typeof window !== 'undefined') {
        window.location.replace('/login');
      }
    }
  },

  // fetch current profile from /auth/me using HTTP-only cookie credentials
  async getProfile(): Promise<AdminUser> {
    if (pendingProfilePromise) {
      return pendingProfilePromise;
    }

    pendingProfilePromise = (async () => {
      try {
        const res = await apiClient<ApiResponse<AdminUser>>('/auth/me', {
          method: 'GET',
        });

        currentUser = res.data;
        notifyAuthListeners();
        return res.data;
      } catch (err) {
        currentUser = null;
        notifyAuthListeners();
        throw err;
      } finally {
        pendingProfilePromise = null;
      }
    })();

    return pendingProfilePromise;
  },

  // update admin avatar
  async updateAvatar(file: File): Promise<AdminUser> {
    const formData = new FormData();
    formData.append('avatar', file);

    const res = await apiClient<ApiResponse<AdminUser>>('/auth/avatar', {
      method: 'PATCH',
      body: formData,
    });

    currentUser = res.data;
    notifyAuthListeners();
    return res.data;
  },

  // delete admin avatar
  async deleteAvatar(): Promise<AdminUser> {
    const res = await apiClient<ApiResponse<AdminUser>>('/auth/avatar', {
      method: 'DELETE',
    });

    currentUser = res.data;
    notifyAuthListeners();
    return res.data;
  },

  // in-memory user getter
  getUser(): AdminUser | null {
    return currentUser;
  },

  // check authentication status
  isAuthenticated(): boolean {
    return !!currentUser;
  },
};
