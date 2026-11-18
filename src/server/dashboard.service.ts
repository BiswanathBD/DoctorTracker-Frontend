import { AuthService } from './auth.service';
import type { DashboardStats } from '@/types/dashboard.types';

export type { DashboardStats };

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const DashboardService = {
  async getStats(days: number = 14): Promise<DashboardStats> {
    const token = AuthService.getToken();
    const res = await fetch(`${API_URL}/dashboard/stats?days=${days}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'failed to fetch dashboard statistics');
    return data.data;
  },
};
