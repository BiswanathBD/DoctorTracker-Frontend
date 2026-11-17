import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin';
  avatar?: {
    url: string;
    key: string;
  };
}

export interface LoginResponse {
  token: string;
  admin: AdminUser;
}

// client-side auth service
export const AuthService = {
  // admin login
  async login(email: string, password: string): Promise<LoginResponse> {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Login failed');
    }

    const { token, admin } = data.data;

    // save token in cookie (expires in 7 days) and localStorage
    Cookies.set('token', token, { expires: 7, secure: process.env.NODE_ENV === 'production' });
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(admin));
    }

    return { token, admin };
  },

  // logout
  logout() {
    Cookies.remove('token');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      window.location.replace('/login');
    }
  },

  // get token
  getToken(): string | undefined {
    return Cookies.get('token');
  },

  // get current user from storage
  getUser(): AdminUser | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  // check if authenticated
  isAuthenticated(): boolean {
    return !!Cookies.get('token');
  },

  // fetch current profile from api
  async getProfile(): Promise<AdminUser> {
    const token = this.getToken();
    if (!token) throw new Error('Not authenticated');

    const res = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch profile');
    }

    const user = data.data;
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
      notifyAuthListeners();
    }
    return user;
  },
};

// listeners for auth store subscription
let listeners: Array<() => void> = [];

const notifyAuthListeners = () => {
  listeners.forEach((listener) => listener());
};

export const subscribeAuth = (callback: () => void) => {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
};

let cachedUser: AdminUser | null = null;
let cachedRaw: string | null = null;

export const getAuthSnapshot = (): AdminUser | null => {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('user');
  if (raw === cachedRaw) return cachedUser;
  cachedRaw = raw;
  try {
    cachedUser = raw ? JSON.parse(raw) : null;
  } catch {
    cachedUser = null;
  }
  return cachedUser;
};

export const getAuthServerSnapshot = (): AdminUser | null => null;
