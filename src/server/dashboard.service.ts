import { apiClient } from './api.client';
import type { DashboardStats } from '@/types/dashboard.types';

export type { DashboardStats };

interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export const DashboardService = {
  async getStats(days: number = 30): Promise<DashboardStats> {
    const res = await apiClient<ApiResponse<DashboardStats>>('/dashboard/stats', {
      params: { days },
    });
    return res.data;
  },
};
